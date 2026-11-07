// 動画を Web 用に軽量化する（macOS 標準の AVFoundation を使用。ffmpeg 不要）
// 使い方: swift scripts/encode-video.swift <入力.mp4> <出力.mp4> <横幅px> <ビットレートMbps> [ポスター.jpg]
// - H.264（どのブラウザでも再生可）、音声なし（自動再生はミュート前提のため）、fast start（先頭から再生開始）
import AVFoundation
import AppKit

let a = CommandLine.arguments
guard a.count >= 5, let width = Int(a[3]), let mbps = Double(a[4]) else {
  print("usage: swift encode-video.swift in.mp4 out.mp4 width mbps [poster.jpg]"); exit(1)
}
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2])
try? FileManager.default.removeItem(at: dst)
let asset = AVURLAsset(url: src)
let sema = DispatchSemaphore(value: 0)

Task {
  do {
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { print("no video"); exit(1) }
    let natural = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let fps = try await track.load(.nominalFrameRate)
    let size = natural.applying(transform)
    let (sw, sh) = (abs(size.width), abs(size.height))
    let outW = min(width, Int(sw)) & ~1
    let outH = Int((Double(outW) * Double(sh) / Double(sw)).rounded()) & ~1

    let reader = try AVAssetReader(asset: asset)
    let rOut = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    reader.add(rOut)

    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: outW, AVVideoHeightKey: outH,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: Int(mbps * 1_000_000),
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoExpectedSourceFrameRateKey: Int(fps.rounded()),
        AVVideoMaxKeyFrameIntervalKey: Int(fps.rounded()),
      ],
    ])
    wIn.transform = transform
    wIn.expectsMediaDataInRealTime = false
    writer.add(wIn)
    reader.startReading(); writer.startWriting(); writer.startSession(atSourceTime: .zero)

    let q = DispatchQueue(label: "enc")
    wIn.requestMediaDataWhenReady(on: q) {
      while wIn.isReadyForMoreMediaData {
        if let buf = rOut.copyNextSampleBuffer() { wIn.append(buf) }
        else {
          wIn.markAsFinished()
          writer.finishWriting {
            let bytes = (try? FileManager.default.attributesOfItem(atPath: dst.path)[.size] as? Int) ?? 0
            print("✓ \(dst.lastPathComponent) \(outW)x\(outH) \(String(format: "%.1f", Double(bytes) / 1_048_576))MB")
            sema.signal()
          }
          return
        }
      }
    }
  } catch { print("error: \(error)"); exit(1) }
}
sema.wait()

// ポスター画像（最初のフレーム付近）
if a.count >= 6 {
  let gen = AVAssetImageGenerator(asset: asset)
  gen.appliesPreferredTrackTransform = true
  gen.maximumSize = CGSize(width: 1920, height: 1920)
  gen.requestedTimeToleranceBefore = .zero
  gen.requestedTimeToleranceAfter = .zero
  let done = DispatchSemaphore(value: 0)
  gen.generateCGImageAsynchronously(for: CMTime(seconds: 0.1, preferredTimescale: 600)) { img, _, err in
    if let img, let data = NSBitmapImageRep(cgImage: img).representation(using: .jpeg, properties: [.compressionFactor: 0.78]) {
      try? data.write(to: URL(fileURLWithPath: a[5]))
      print("✓ poster \(URL(fileURLWithPath: a[5]).lastPathComponent) \(data.count / 1024)KB")
    } else { print("poster error: \(String(describing: err))") }
    done.signal()
  }
  done.wait()
}
