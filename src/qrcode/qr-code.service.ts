// import * as qrCode from 'qrcode';
// import * as fs from 'fs/promises';

// export class QrCodeService {
//     async generateQrCode(data: string, outputPath: string): Promise<string> {
//         const qrCodeBuffer = await qrCode.toBuffer(data);
//         await fs.writeFile(outputPath, qrCodeBuffer);
//         return outputPath;
//     }
// }