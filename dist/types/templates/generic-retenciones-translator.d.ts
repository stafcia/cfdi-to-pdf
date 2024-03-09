import { Content, Style, TableCell, TableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { DocumentTranslatorInterface } from './document-translator-interface';
import { RetencionesData } from '../retenciones-data';
export declare class GenericRetencionesTranslator implements DocumentTranslatorInterface<RetencionesData> {
    version: string;
    protected tableLayoutBordered(): TableLayout;
    protected generateFooter(version: string, uuid: string, currentPage: number, pageCount: number): Content;
    protected generateTopContent(retenciones: CNodeInterface, logo?: string): Content;
    protected generateEmisorContent(emisor: CNodeInterface): Content;
    protected generateReceptorContent(receptor: CNodeInterface): Content;
    protected generatePeriodoContent(periodo: CNodeInterface, claveRet: string): Content;
    protected generateImpuestosRetenidos(impuestosRetenidos: CNodeInterface[]): TableCell[][];
    protected generateTotales(totales: CNodeInterface): Content;
    protected generateStampContent(data: RetencionesData): Content;
    protected contentService(service: CNodeInterface): TableCell[][];
    protected generateContentPerService(servicios: CNodes): TableCell[][];
    protected generatePlataformasTecnologicas(plataformasTecnologicas: CNodeInterface): Content;
    protected generateContent(data: RetencionesData): Content;
    translate(data: RetencionesData, defaultStyle: Style): TDocumentDefinitions;
}
