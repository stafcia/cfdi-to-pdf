import { Content, Style, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { DocumentTranslatorInterface } from './document-translator-interface';
import { CfdiData } from '../cfdi-data';
export declare class GenericCfdiTranslator implements DocumentTranslatorInterface<CfdiData> {
    protected generateFooter(version: string, uuid: string, currentPage: number, pageCount: number): Content;
    protected generateTopContent(comprobante: CNodeInterface, logo?: string): Content;
    protected generateEmisorContent(emisor: CNodeInterface): Content;
    protected generateAddress(receptor: CNodeInterface, address?: string): TableCell[][];
    protected generateReceptorContent(receptor: CNodeInterface, address?: string): Content;
    protected useGlobalInformation(comprobante: CNodeInterface, currentContent: Content[]): void;
    protected generateGeneralInvoiceInfoContent(comprobante: CNodeInterface): Content;
    protected generateImpuestos(concepto: CNodeInterface): Content[];
    protected generateConceptsContent(conceptos: CNodes): Content;
    protected generateCurrencyRelatedInfo(comprobante: CNodeInterface): Content;
    protected generateStampContent(cfdiData: CfdiData): Content;
    protected generateNominaTopContent(comprobante: CNodeInterface): Content;
    protected generateNominaMiddleContent(comprobante: CNodeInterface): Content;
    protected generateContent(cfdiData: CfdiData): Content;
    translate(cfdiData: CfdiData, defaultStyle: Style): TDocumentDefinitions;
}
