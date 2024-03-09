import { Style, TDocumentDefinitions } from 'pdfmake/interfaces';
import { BuilderInterface } from './builder-interface';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';
export declare class PdfMakerBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private readonly _documentTranslator;
    private readonly _defaultStyle;
    constructor(documentTranslator: DocumentTranslatorInterface<T>, defaultStyle?: Style);
    build(data: T, destination: string): Promise<void>;
    buildBase64(data: T): Promise<string>;
    buildPdf(data: T): TDocumentDefinitions;
}
