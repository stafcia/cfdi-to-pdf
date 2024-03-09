import { Style, TDocumentDefinitions } from 'pdfmake/interfaces';
import { BuilderInterface } from './builder-interface';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';
export declare class PdfMakerBrowserBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private _documentTranslator;
    private readonly _defaultStyle;
    constructor(documentTranslator: DocumentTranslatorInterface<T>, defaultStyle?: Style);
    build(_data: T, _destination: string): Promise<void>;
    buildBase64(data: T): Promise<string>;
    buildPdf(data: T): TDocumentDefinitions;
}
