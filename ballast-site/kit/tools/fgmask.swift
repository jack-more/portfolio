import Foundation
import Vision
import CoreImage
import AppKit
let args = CommandLine.arguments
guard args.count == 3, let img = NSImage(contentsOfFile: args[1]), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("usage: fgmask in out"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([req])
guard let res = req.results?.first else { print("no subject"); exit(2) }
let buf = try res.generateScaledMaskForImage(forInstances: res.allInstances, from: handler)
let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
let out = ctx.createCGImage(ci, from: ci.extent)!
let rep = NSBitmapImageRep(cgImage: out)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
print("ok", out.width, out.height)
