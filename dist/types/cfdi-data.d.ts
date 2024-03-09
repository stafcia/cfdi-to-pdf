import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractInvoiceData } from './abstract-invoice-data';
export declare class CfdiData extends AbstractInvoiceData {
    private readonly _comprobante;
    private readonly _address;
    constructor(comprobante: CNodeInterface, qrUrl: string, tfdSourceString: string, logo?: string, address?: string, additionalFields?: {
        title: string;
        value: string;
    }[], additionalFieldsUP?: {
        title: string;
        value: string;
    }[]);
    comprobante(): CNodeInterface;
    address(): string | undefined;
}
