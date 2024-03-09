import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
export declare abstract class AbstractInvoiceData {
    protected _emisor: CNodeInterface;
    protected _receptor: CNodeInterface;
    protected _timbreFiscalDigital: CNodeInterface;
    protected _qrUrl: string;
    protected _tfdSourceString: string;
    protected _logo: string | undefined;
    protected _additionalFields: {
        title: string;
        value: string;
    }[] | undefined;
    protected _additionalFieldsUP: {
        title: string;
        value: string;
    }[] | undefined;
    emisor(): CNodeInterface;
    receptor(): CNodeInterface;
    timbreFiscalDigital(): CNodeInterface;
    qrUrl(): string;
    tfdSourceString(): string;
    logo(): string | undefined;
    additionalFields(): {
        title: string;
        value: string;
    }[] | undefined;
    additionalFieldsUP(): {
        title: string;
        value: string;
    }[] | undefined;
    buildUrlQr(node: CNodeInterface): void;
}
