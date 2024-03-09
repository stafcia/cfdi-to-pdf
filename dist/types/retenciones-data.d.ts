import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractInvoiceData } from './abstract-invoice-data';
export declare class RetencionesData extends AbstractInvoiceData {
    private readonly _retenciones;
    private readonly _periodo;
    private readonly _totales;
    constructor(retenciones: CNodeInterface, qrUrl: string, tfdSourceString: string, logo?: string, additionalFields?: {
        title: string;
        value: string;
    }[], additionalFieldsUP?: {
        title: string;
        value: string;
    }[]);
    retenciones(): CNodeInterface;
    periodo(): CNodeInterface;
    totales(): CNodeInterface;
}
