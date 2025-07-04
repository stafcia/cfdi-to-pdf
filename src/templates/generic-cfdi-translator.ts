import {
    Column,
    Content,
    ContentColumns,
    ContentTable,
    Style,
    TableCell,
    TDocumentDefinitions
} from 'pdfmake/interfaces';
import { CNodeInterface, CNodes } from '@nodecfdi/cfdiutils-common';
import { DocumentTranslatorInterface } from './document-translator-interface';
import { CfdiData } from '../cfdi-data';
import { formatCurrency, toCurrency } from '../utils/currency';
import { breakEveryNCharacters } from '../utils/break-characters';
import { usePago10Complement } from './complements/pago10-complement';
import { usePago20Complement } from './complements/pago20-complement';
import { useImpLocal10Complement } from './complements/imp-local10-complement';

export class GenericCfdiTranslator implements DocumentTranslatorInterface<CfdiData> {
    protected generateFooter(version: string, uuid: string, currentPage: number, pageCount: number): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: `Este documento es una representación impresa de un Comprobante Fiscal Digital a través de Internet versión ${version}`,
                            style: 'tableList',
                            colSpan: 4,
                            alignment: 'center'
                        },
                        {},
                        {},
                        {}
                    ],
                    [
                        {
                            text: `UUID: ${uuid} - Página ${currentPage} de ${pageCount}`,
                            style: 'tableList',
                            colSpan: 4,
                            alignment: 'center'
                        },
                        {},
                        {},
                        {}
                    ]
                ]
            },
            layout: 'noBorders'
        };
    }

    protected generateTopContent(comprobante: CNodeInterface, logo?: string): Content {
        const header: ContentColumns = {
            columns: [
                {
                    width: '*',
                    alignment: 'left',
                    style: 'tableContent',
                    table: {
                        widths: ['*'],
                        body: [['']]
                    },
                    layout: 'lightHorizontalLines'
                },
                {
                    width: 'auto',
                    alignment: 'center',
                    style: 'tableContent',
                    table: {
                        widths: ['auto', 'auto'],
                        body: [
                            ['SERIE:', { text: comprobante.get('Serie'), style: 'serieAndFolio' }],
                            ['FOLIO:', { text: comprobante.get('Folio'), style: 'serieAndFolio' }],
                            ['FECHA:', comprobante.get('Fecha')],
                            ['EXPEDICIÓN:', comprobante.get('LugarExpedicion')],
                            ['COMPROBANTE:', comprobante.get('TipoDeComprobante')],
                            ['VERSIÓN:', comprobante.get('Version')]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ]
        };
        if (logo) {
            //Se modifico para poner el logo de salsa de [80, 80]
            (header.columns[0] as ContentTable).table.body[0][0] = { image: logo, fit: [302, 90] };
            (header.columns[0] as ContentTable).table.widths = ['*'];
        }

        return header;
    }

    protected generateEmisorContent(emisor: CNodeInterface): Content {
        return {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: 'EMISOR',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'left'
                        },
                        {},
                        {},
                        {}
                    ],
                    ['NOMBRE:', emisor.get('Nombre'), 'RFC:', emisor.get('Rfc')],
                    ['REGIMEN FISCAL:', { colSpan: 3, text: emisor.get('RegimenFiscal') }, {}, {}]
                ]
            },
            layout: 'lightHorizontalLines'
        };
    }

    protected generateAddress(receptor: CNodeInterface, address?: string): TableCell[][] {
        const tableCell: TableCell[][] = [];
        const cellAddress: TableCell[] = [];
        if (address || receptor.offsetExists('DomicilioFiscalReceptor')) {
            if (address && address.includes('91914')) {
                cellAddress.push('DOMICILIO:', `${address ? address + ' ' : ''}`);
            } else {
                cellAddress.push(
                    'DOMICILIO:',
                    `${address ? address + ' ' : ''}${receptor.get('DomicilioFiscalReceptor')}`
                );
            }
        }
        cellAddress.push('USO CFDI', {
            colSpan: address || receptor.offsetExists('DomicilioFiscalReceptor') ? 1 : 3,
            text: receptor.get('UsoCFDI')
        });
        tableCell.push(cellAddress);
        if (receptor.offsetExists('ResidenciaFiscal') && receptor.offsetExists('NumRegIdTrib')) {
            tableCell.push([
                'RESIDENCIA FISCAL:',
                receptor.get('ResidenciaFiscal'),
                'NUMERO ID TRIB.:',
                receptor.get('NumRegIdTrib')
            ]);
        }

        return tableCell;
    }

    protected generateReceptorContent(receptor: CNodeInterface, address?: string): Content {
        const receptorContent: Content = {
            style: 'tableContent',
            table: {
                widths: ['auto', '*', 'auto', 'auto'],
                body: [
                    [
                        {
                            text: 'RECEPTOR',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'left'
                        },
                        {},
                        {},
                        {}
                    ],
                    ['NOMBRE:', receptor.get('Nombre'), 'RFC:', receptor.get('Rfc')],
                    ...this.generateAddress(receptor, address)
                ]
            },
            layout: 'lightHorizontalLines'
        };

        if (receptor.offsetExists('RegimenFiscalReceptor')) {
            receptorContent.table.body.push([
                'REGIMEN FISCAL',
                {
                    colSpan: 3,
                    text: receptor.get('RegimenFiscalReceptor')
                },
                {},
                {}
            ]);
        }

        return receptorContent;
    }

    protected useGlobalInformation(comprobante: CNodeInterface, currentContent: Content[]): void {
        const globalInformation = comprobante.searchNode('cfdi:InformacionGlobal');
        if (globalInformation === undefined) return;
        currentContent.push({
            style: 'tableContent',
            table: {
                widths: ['*', '*', '*'],
                body: [
                    [
                        {
                            text: 'INFORMACIÓN GLOBAL',
                            style: 'tableHeader',
                            colSpan: 3,
                            alignment: 'left'
                        },
                        {},
                        {}
                    ],
                    [
                        `Periodicidad: ${globalInformation.get('Periodicidad')}`,
                        `Meses: ${globalInformation.get('Meses')}`,
                        `Año: ${globalInformation.get('Año')}`
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        });
        //currentContent.push('\n');
    }

    protected generateGeneralInvoiceInfoContent(comprobante: CNodeInterface): Content {
        return {
            style: 'tableContent',
            table: {
                widths: [95, '*', 95, '*'],
                body: [
                    [
                        {
                            text: 'DATOS GENERALES DEL COMPROBANTE',
                            style: 'tableHeader',
                            colSpan: 4,
                            alignment: 'left'
                        },
                        {},
                        {},
                        {}
                    ],
                    ['MONEDA:', comprobante.get('Moneda'), 'FORMA PAGO:', comprobante.get('FormaPago')],
                    [
                        'METODO DE PAGO:',
                        comprobante.get('MetodoPago'),
                        'CONDICIONES DE PAGO:',
                        comprobante.get('CondicionesDePago')
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        };
    }

    protected generateImpuestos(concepto: CNodeInterface): Content[] {
        const impuestosContent: Content[] = [];
        const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
        const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');
        if (traslados.length > 0) {
            impuestosContent.push('Traslados');
            const contentT = traslados.map<TableCell[]>((traslado) => {
                return [
                    traslado.get('Impuesto'),
                    traslado.get('TipoFactor') === 'Exento' ? 'EXENTO' : formatCurrency(traslado.get('Importe'))
                ];
            });
            impuestosContent.push({
                table: {
                    body: contentT
                },
                layout: 'noBorders'
            });
        }
        if (retenciones.length > 0) {
            impuestosContent.push('Retenciones');
            const contentR = retenciones.map<TableCell[]>((retencion) => {
                return [retencion.get('Impuesto'), formatCurrency(retencion.get('Importe'))];
            });
            impuestosContent.push({
                table: {
                    body: contentR
                },
                layout: 'noBorders'
            });
        }

        return impuestosContent;
    }

    protected generateConceptsContent(conceptos: CNodes): Content {
        const rowsConceptos = conceptos.map<TableCell[]>((concepto) => {
            return [
                concepto.get('ClaveProdServ'),
                concepto.get('Cantidad'),
                concepto.get('ClaveUnidad'),
                concepto.get('NoIdentificacion') || '(Ninguno)',
                concepto.get('Descripcion'),
                formatCurrency(concepto.get('ValorUnitario')),
                formatCurrency(concepto.get('Descuento')),
                {
                    colSpan: 2,
                    stack: this.generateImpuestos(concepto)
                },
                '',
                formatCurrency(concepto.get('Importe'))
            ];
        });

        rowsConceptos.unshift([
            'ClaveProdServ',
            'Cant',
            'Clave Unidad',
            'Identificación',
            'Descripción',
            'Valor Unitario',
            'Descuento',
            {
                colSpan: 2,
                text: 'Impuesto'
            },
            '',
            'Importe'
        ]);

        return {
            style: 'tableList',
            table: {
                widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: rowsConceptos
            },
            layout: {
                fillColor(i): string | null {
                    return i === 0 ? '#CCCCCC' : null;
                }
            }
        };
    }

    protected generateCurrencyRelatedInfo(comprobante: CNodeInterface): Content {
        //const totalImpuestosTrasladados = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosTrasladados');
        //const totalImpuestosRetenidos = comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosRetenidos');
        //const totalTasasTraslados = comprobante.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
        const contentColumns: Column[] = [];
        const relatedInfoAndImport: Column[] = [];
        if (comprobante.get('TipoDeComprobante') !== 'P') {
            relatedInfoAndImport.push({
                fontSize: 7,
                margin: [0, 5, 0, 0],
                columns: [
                    { width: 'auto', text: 'IMPORTE CON LETRA:', margin: [0, 0, 5, 0] },
                    {
                        width: 'auto',
                        text: toCurrency(parseFloat(comprobante.get('Total') || '0'), comprobante.get('Moneda'))
                    },
                    { width: '*', text: '' }
                ]
            });
        }
        if (comprobante.get('Version') === '3.3') {
            const relacionados = comprobante.searchNode('cfdi:CfdiRelacionados');
            if (relacionados) {
                const uuidsArray = relacionados.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
                    return [`UUID: ${relacionado.get('UUID')}`];
                });

                relatedInfoAndImport.push({
                    fontSize: 7,
                    margin: [0, 5, 0, 0],
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: `CFDIS RELACIONADOS - TIPO RELACIÓN ${relacionados.get('TipoRelacion')}`,
                                    fillColor: '#CCCCCC'
                                }
                            ],
                            ...uuidsArray
                        ]
                    }
                });
            }
        } else {
            const relacionados = comprobante.searchNodes('cfdi:CfdiRelacionados');
            if (relacionados.length > 0) {
                for (const relacionadosNode of relacionados) {
                    const uuidsArray = relacionadosNode.searchNodes('cfdi:CfdiRelacionado').map((relacionado) => {
                        return [`UUID: ${relacionado.get('UUID')}`];
                    });

                    relatedInfoAndImport.push({
                        fontSize: 7,
                        margin: [0, 5, 0, 0],
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    {
                                        text: `CFDIS RELACIONADOS - TIPO RELACIÓN ${relacionadosNode.get(
                                            'TipoRelacion'
                                        )}`,
                                        fillColor: '#CCCCCC'
                                    }
                                ],
                                ...uuidsArray
                            ]
                        }
                    });
                }
            }
        }
        contentColumns.push(relatedInfoAndImport);
        if (comprobante.get('TipoDeComprobante') !== 'P' && comprobante.get('TipoDeComprobante') !== 'N') {
            contentColumns.push({
                width: 'auto',
                alignment: 'right',
                style: 'tableContent',
                margin: [10, 0, 0, 0],
                table: {
                    widths: ['auto', 'auto'],
                    body: [
                        ['SUBTOTAL:', { text: formatCurrency(comprobante.get('SubTotal')), fontSize: 9 }],
                        ['DESCUENTO:', formatCurrency(comprobante.get('Descuento'))],
                        [
                            {
                                text: 'TOTAL:',
                                fontSize: 11,
                                bold: true
                            },
                            { text: formatCurrency(comprobante.get('Total')), fontSize: 11, bold: true }
                        ]
                    ]
                },
                layout: 'lightHorizontalLines'
            });
        }
        if (comprobante.get('TipoDeComprobante') === 'N') {
            const deducciones = comprobante.searchAttribute(
                'cfdi:Complemento',
                'nomina12:Nomina',
                'nomina12:Deducciones',
                'TotalOtrasDeducciones'
            );
            const impRetenidos = comprobante.searchAttribute(
                'cfdi:Complemento',
                'nomina12:Nomina',
                'nomina12:Deducciones',
                'TotalImpuestosRetenidos'
            );
            if (deducciones === undefined || impRetenidos === undefined) return '';

            contentColumns.push({
                width: 'auto',
                alignment: 'right',
                style: 'tableContent',
                margin: [10, 0, 0, 0],
                table: {
                    widths: ['auto', 'auto'],
                    body: [
                        ['SUBTOTAL:', { text: formatCurrency(comprobante.get('SubTotal')), fontSize: 9 }],
                        ['DESCUENTOS:', formatCurrency(deducciones)],
                        ['RETENCIONES', formatCurrency(impRetenidos)],
                        [
                            {
                                text: 'TOTAL RECIBO:',
                                fontSize: 11,
                                bold: true
                            },
                            { text: formatCurrency(comprobante.get('Total')), fontSize: 11, bold: true }
                        ]
                    ]
                },
                layout: 'lightHorizontalLines'
            });
        }

        return {
            columns: contentColumns
        };
    }

    protected generateStampContent(cfdiData: CfdiData): Content {
        const comprobante = cfdiData.comprobante();
        const tfd = cfdiData.timbreFiscalDigital();
        const tfdSourceString = cfdiData.tfdSourceString();
        const qrUrl = cfdiData.qrUrl();
        const tfdCellsTable: TableCell[][] = [];
        if (tfd) {
            tfdCellsTable.push(
                [
                    {
                        colSpan: 1,
                        rowSpan: 8,
                        qr: qrUrl,
                        fit: 120
                    },
                    '',
                    ''
                ],
                ['', 'NUMERO SERIE CERTIFICADO SAT', tfd.get('NoCertificadoSAT')],
                ['', 'NUMERO SERIE CERTIFICADO EMISOR', comprobante.get('NoCertificado')],
                ['', 'FECHA HORA CERTIFICACIÓN', tfd.get('FechaTimbrado')],
                ['', 'FOLIO FISCAL UUID', tfd.get('UUID')],
                ['', 'SELLO DIGITAL', breakEveryNCharacters(tfd.get('SelloCFD'), 86)],
                ['', 'SELLO DEL SAT', breakEveryNCharacters(tfd.get('SelloSAT'), 86)]
            );
        }
        tfdCellsTable.push([
            '',
            'CADENA ORIGINAL CC:',
            {
                text: breakEveryNCharacters(tfdSourceString, 86)
            }
        ]);

        return {
            style: 'tableSat',
            table: {
                widths: ['auto', 'auto', '*'],
                body: tfdCellsTable
            },
            layout: 'lightHorizontalLines'
        };
    }

    protected generateNominaTopContent(comprobante: CNodeInterface): Content {
        const nomina = comprobante.searchNode('cfdi:Complemento', 'nomina12:Nomina');
        const receptor = comprobante.searchNode('cfdi:Receptor');
        const nominaEmisor = comprobante.searchNode('cfdi:Complemento', 'nomina12:Nomina', 'nomina12:Emisor');
        const nominaReceptor = comprobante.searchNode('cfdi:Complemento', 'nomina12:Nomina', 'nomina12:Receptor');

        if (
            nomina === undefined ||
            nominaEmisor === undefined ||
            nominaReceptor === undefined ||
            receptor === undefined
        )
            return '';
        console.log(nomina);
        return {
            style: 'tableContent',
            table: {
                widths: ['50%', '50%'],
                body: [
                    [
                        {
                            text: 'NOMINA',
                            style: 'tableHeader',
                            colSpan: 2,
                            alignment: 'left'
                        },
                        {}
                    ],
                    [
                        nominaReceptor.get('NumEmpleado') + ' - ' + receptor.get('Nombre'),
                        'PERIODO DEL: ' + nomina.get('FechaInicialPago') + ' AL: ' + nomina.get('FechaFinalPago')
                    ],
                    [
                        'RFC: \t' + receptor.get('Rfc'),
                        'PEROIODICIDAD PAGO: \t' + nominaReceptor.get('PeriodicidadPago')
                    ],
                    ['CURP: \t' + nominaReceptor.get('Curp'), 'FECHA PAGO: \t' + nomina.get('FechaPago')],
                    [
                        'FECHA INI REL LABORAL: \t' + nominaReceptor.get('FechaInicioRelLaboral'),
                        'PUESTO: \t' + nominaReceptor.get('Puesto')
                    ],
                    [
                        'JORNADA: \t' + nominaReceptor.get('TipoJornada'),
                        'DEPARTAMENTO: \t' + nominaReceptor.get('Departamento')
                    ],
                    [
                        'NSS: \t' + nominaReceptor.get('NumSeguridadSocial'),
                        'SBC: \t' + nominaReceptor.get('SalarioBaseCotApor')
                    ],
                    ['TIPO SALARIO: \t' + 'MIXTO', 'SALARIO DIARIO: \t' + nominaReceptor.get('SalarioDiarioIntegrado')],
                    [
                        'DOMICILIO FISCAL: \t' + receptor.get('DomicilioFiscalReceptor'),
                        'REGIMEN FISCAL: \t' + receptor.get('RegimenFiscalReceptor')
                    ]
                ]
            },
            layout: 'lightHorizontalLines'
        };
    }

    protected generateNominaMiddleContent(comprobante: CNodeInterface): Content {
        const nominaPercepciones = comprobante.searchNodes(
            'cfdi:Complemento',
            'nomina12:Nomina',
            'nomina12:Percepciones',
            'nomina12:Percepcion'
        );
        const nominaDeducciones = comprobante.searchNodes(
            'cfdi:Complemento',
            'nomina12:Nomina',
            'nomina12:Deducciones',
            'nomina12:Deduccion'
        );
        const nominaOtrosPagos = comprobante.searchNodes(
            'cfdi:Complemento',
            'nomina12:Nomina',
            'nomina12:OtrosPagos',
            'nomina12:OtroPago'
        );

        if (nominaPercepciones === undefined || nominaDeducciones === undefined || nominaOtrosPagos === undefined)
            return '';

        const rowOtrosPagos = nominaOtrosPagos.map<TableCell[]>((otroPago) => {
            return [
                'OP-' + otroPago.get('TipoOtroPago'),
                otroPago.get('Clave'),
                otroPago.get('Concepto'),
                formatCurrency(0.0),
                formatCurrency(otroPago.get('Importe'))
            ];
        });
        const rowsPercepciones = nominaPercepciones.map<TableCell[]>((percepcion) => {
            return [
                'P-' + percepcion.get('TipoPercepcion'),
                percepcion.get('Clave'),
                percepcion.get('Concepto'),
                formatCurrency(percepcion.get('ImporteGravado')),
                formatCurrency(percepcion.get('ImporteExcento'))
            ];
        });
        rowOtrosPagos.forEach((pago) => {
            rowsPercepciones.push(pago);
        });
        rowsPercepciones.unshift(['Tipo Percepción', 'Clave', 'Concepto', 'Importe Gravado', 'Importe Exento']);

        const rowsDeducciones = nominaDeducciones.map<TableCell[]>((deduccion) => {
            return [
                deduccion.get('TipoDeduccion'),
                deduccion.get('Clave'),
                deduccion.get('Concepto'),
                formatCurrency(deduccion.get('Importe'))
            ];
        });
        rowsDeducciones.unshift(['Tipo Deducción', 'Clave', 'Concepto', 'Importe']);
        return {
            style: 'tableContent',
            table: {
                widths: ['60%', '40%'],
                body: [
                    [
                        {
                            text: 'Percepciones',
                            style: 'tableHeader',
                            alignment: 'left'
                        },
                        {
                            text: 'Deducciones',
                            style: 'tableHeader',
                            alignment: 'left'
                        }
                    ],
                    [
                        {
                            style: 'tableList',
                            table: {
                                widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                                body: rowsPercepciones
                            },
                            layout: {
                                fillColor(i): string | null {
                                    return i === 0 ? '#CCCCCC' : null;
                                }
                            }
                        },
                        {
                            style: 'tableList',
                            table: {
                                widths: ['auto', 'auto', 'auto', 'auto'],
                                body: rowsDeducciones
                            },
                            layout: {
                                fillColor(i): string | null {
                                    return i === 0 ? '#CCCCCC' : null;
                                }
                            }
                        }
                    ]
                ]
            },
            layout: {
                fillColor(i): string | null {
                    return i === 0 ? '#CCCCCC' : null;
                }
            }
        };
    }

    protected generateContent(cfdiData: CfdiData): Content {
        const comprobante = cfdiData.comprobante();
        const emisor = cfdiData.emisor();
        const receptor = cfdiData.receptor();
        const conceptos = comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto');
        const additionalFields = cfdiData.additionalFields();
        const additionalFields2 = cfdiData.additionalFieldsUP();

        const content: Content[] = [];
        content.push(this.generateTopContent(comprobante, cfdiData.logo()));
        //content.push('\n');
        content.push(this.generateEmisorContent(emisor));
        //content.push('\n');
        if (comprobante.get('TipoDeComprobante') !== 'N') {
            content.push(this.generateReceptorContent(receptor, cfdiData.address()));
            //content.push('\n');
        }
        if (additionalFields2) {
            additionalFields2.forEach((element) => {
                content.push({
                    style: 'tableContent',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: element.title, style: 'tableHeader' }],
                            [{ text: element.value, style: 'infoHighlight' }]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                });
                //content.push('\n');
            });
        }
        if (comprobante.get('TipoDeComprobante') !== 'P') {
            this.useGlobalInformation(comprobante, content);
            content.push(this.generateGeneralInvoiceInfoContent(comprobante));
            //content.push('\n');
        }
        if (comprobante.get('TipoDeComprobante') === 'N') {
            //Implementar el contenido de nomina
            //Temporal Nominas
            content.push(this.generateNominaTopContent(comprobante));
            content.push('\n');
            content.push(this.generateNominaMiddleContent(comprobante));
            content.push('\n');
        }

        if (comprobante.get('TipoDeComprobante') !== 'N') {
            content.push(this.generateConceptsContent(conceptos));
            //content.push('\n');
        }
        content.push(this.generateCurrencyRelatedInfo(comprobante));
        //content.push('\n');

        /** Area of complements */
        usePago10Complement(comprobante, content);
        usePago20Complement(comprobante, content);
        useImpLocal10Complement(comprobante, content);
        /** **/

        if (additionalFields) {
            additionalFields.forEach((element) => {
                content.push({
                    style: 'tableContent',
                    table: {
                        widths: ['*'],
                        body: [
                            [{ text: element.title, style: 'tableHeader' }],
                            [{ text: element.value, style: 'infoHighlight' }]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                });
                content.push('\n');
            });
        }

        content.push(this.generateStampContent(cfdiData));

        return content;
    }

    public translate(cfdiData: CfdiData, defaultStyle: Style): TDocumentDefinitions {
        const comprobante = cfdiData.comprobante();
        const tfd = cfdiData.timbreFiscalDigital();

        return {
            content: this.generateContent(cfdiData),
            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                },
                infoHighlight: {
                    fontSize: 11,
                    color: 'black'
                },
                //Se agrega estilo para los datos grandes de serie y folio
                serieAndFolio: {
                    bold: true,
                    fontSize: 15,
                    color: 'red'
                },
                tableContent: {
                    fontSize: 8,
                    color: 'black',
                    alignment: 'left'
                },
                tableList: {
                    fontSize: 7,
                    color: 'black',
                    alignment: 'center'
                },
                tableSat: {
                    fontSize: 5,
                    color: 'black',
                    alignment: 'left'
                }
            },
            defaultStyle,
            footer: (currentPage, pageCount) =>
                this.generateFooter(comprobante.get('Version'), tfd.get('UUID'), currentPage, pageCount)
        };
    }
}
