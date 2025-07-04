/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { BufferOptions, CustomTableLayout, TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
export interface PdfKitDocument extends NodeJS.ReadableStream {
    end(): void;
}
export interface TCreatedPdf {
    download(cb?: () => void, options?: BufferOptions): void;
    download(defaultFileName: string, cb?: () => void, options?: BufferOptions): void;
    getBlob(cb: (result: Blob) => void, options?: BufferOptions): void;
    getBase64(cb: (result: string) => void, options?: BufferOptions): void;
    getBuffer(cb: (result: Buffer) => void, options?: BufferOptions): void;
    getDataUrl(cb: (result: string) => void, options?: BufferOptions): void;
    getStream(options?: BufferOptions): PdfKitDocument;
    open(options?: BufferOptions, win?: Window | null): void;
    print(options?: BufferOptions, win?: Window | null): void;
}
export interface PdfMakeBrowser {
    createPdf(documentDefinitions: TDocumentDefinitions, tableLayouts?: {
        [name: string]: CustomTableLayout;
    }, fonts?: TFontDictionary, vfs?: {
        [file: string]: string;
    }): TCreatedPdf;
}
export interface PdfMakeNode {
    createPdfKitDocument(docDefinition: TDocumentDefinitions, options?: BufferOptions): PdfKitDocument;
}
declare const getPdfMake: <T extends PdfMakeBrowser | PdfMakeNode>() => T;
declare const installPdfMake: (pdfMake: PdfMakeBrowser | PdfMakeNode) => void;
export { getPdfMake, installPdfMake };
