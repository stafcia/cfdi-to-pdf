!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("@nodecfdi/cfdi-expresiones"),require("@nodecfdi/cfdiutils-common")):"function"==typeof define&&define.amd?define(["exports","@nodecfdi/cfdi-expresiones","@nodecfdi/cfdiutils-common"],t):t((e||self).cfdiToPdf={},e.cfdiExpresiones,e.cfdiutilsCommon)}(this,function(e,t,o){class n{constructor(){this._emisor=void 0,this._receptor=void 0,this._timbreFiscalDigital=void 0,this._qrUrl=void 0,this._tfdSourceString=void 0,this._logo=void 0,this._additionalFields=void 0,this._additionalFieldsUP=void 0}emisor(){return this._emisor}receptor(){return this._receptor}timbreFiscalDigital(){return this._timbreFiscalDigital}qrUrl(){return this._qrUrl}tfdSourceString(){return this._tfdSourceString}logo(){return this._logo}additionalFields(){return this._additionalFields}additionalFieldsUP(){return this._additionalFieldsUP}buildUrlQr(e){const n=o.XmlNodeUtils.nodeToXmlString(e,!0),a=o.getParser().parseFromString(n,"text/xml");try{this._qrUrl=(new t.DiscoverExtractor).extract(a)}catch(e){}}}const a=e=>{const t=["cero","un","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince"],o=["","dieci","veinti","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],n=["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];let a="";if(3===e.length){switch(parseInt(e,10)){case 100:return"cien ";case 0:return"";default:a+=`${n[parseInt(e[0],10)]} `}e=e.substring(1,3)}if(parseInt(e,10)<=15){if("00"===e)return a;a+=`${t[parseInt(e,10)]} `}else{const n="0"===e[1];if(20===parseInt(e,10))return`${a}veinte `;a+=o[parseInt(e[0],10)]+(parseInt(e[0],10)>=3&&!n?" y ":"")+(n?"":t[parseInt(e[1],10)])+" "}return a},l=(e,t)=>{const o=e.toFixed(2);let n=o.substring(0,o.indexOf("."));const l=o.substring(o.indexOf(".")+1,o.length),i=t&&"MXN"!==t?t:"M.N.";let s="",r=!1,d=!1,c=!1;if(n.length<=12){if(12===n.length||11===n.length||10===n.length){const e=n.substring(0,n.length-9);switch(c=!0,parseInt(e,10)){case 0:break;case 1:s+="mil ";break;default:s+=`${a(e)}mil `}n=n.substring(n.length-9,n.length)}if(9===n.length||8===n.length||7===n.length){const e=n.substring(0,n.length-6);s+=a(e),c||1!==parseInt(e,10)?s+="millones ":s+="millón ",n=n.substring(n.length-6,n.length)}if(6===n.length||5===n.length||4===n.length){const e=n.substring(0,n.length-3);switch(r=0===parseInt(e,10),parseInt(e,10)){case 0:break;case 1:s+="mil ";break;default:s+=`${a(e)}mil `}n=n.substring(n.length-3,n.length)}return d=0===parseInt(n,10),s+=a(n),s+=`${(r&&d?"de ":"")+("un "===s?"peso ":"pesos ")+l}/100 ${i}`,s.toUpperCase()}throw new Error("El número es demasiado grande.")},i=e=>{"string"==typeof e&&(e=Number(e));const t=Number.isNaN(e)?0:Number(e);return Intl.NumberFormat("en-US",{style:"currency",currency:"USD",currencyDisplay:"symbol"}).format(t)},s=function(e,t){void 0===t&&(t=86);const o=e.match(new RegExp(`.{1,${t}}`,"g"));let n=e;return o&&(n=o.reduce((e,t)=>`${e}\n${t}`)),n};class r extends Error{constructor(e){super(e),this.name="PdfmakeNotFound"}}let d;const c=()=>{if(!d)throw new r("No pdfmake was provided.");return d},u=e=>{const t=e.map(e=>[e.get("IdDocumento"),e.get("MetodoDePagoDR"),e.get("MonedaDR"),e.get("TipoCambioDR"),e.get("NumParcialidad"),i(e.get("ImpSaldoAnt")||"0"),i(e.get("ImpPagado")||"0"),i(e.get("ImpSaldoInsoluto")||"0")]);return t.unshift(["UUID","Método de Pago","Moneda","Tipo de Cambio","Num. Parcialidad","Importe Saldo Anterior","Importe Pagado","Importe Saldo Insoluto"]),t.unshift([{text:"DOCUMENTOS RELACIONADOS",style:"tableHeader",colSpan:8,alignment:"center"},{},{},{},{},{},{},{}]),t},g=e=>{const t=e.map(e=>[e.get("IdDocumento"),`${e.get("Serie")}/${e.get("Folio")}`,e.get("MonedaDR"),e.get("EquivalenciaDR"),e.get("NumParcialidad"),i(e.get("ImpSaldoAnt")||"0"),i(e.get("ImpPagado")||"0"),i(e.get("ImpSaldoInsoluto")||"0")]);return t.unshift(["UUID","Serie / Folio","Moneda","Tipo de Cambio","Num. Parcialidad","Importe Saldo Anterior","Importe Pagado","Importe Saldo Insoluto"]),t.unshift([{text:"DOCUMENTOS RELACIONADOS",style:"tableHeader",colSpan:8,alignment:"center"},{},{},{},{},{},{},{}]),t},h=(e,t,o)=>{e.offsetExists(t)&&o.push({text:`${t}: ${e.get(t)}`,fontSize:7})},f=e=>{const t=[],o=[],n=[];if(h(e,"TotalRetencionesIVA",o),h(e,"TotalRetencionesISR",o),h(e,"TotalRetencionesIEPS",o),h(e,"TotalTrasladosBaseIVA16",o),h(e,"TotalTrasladosImpuestoIVA16",o),h(e,"TotalTrasladosBaseIVA8",n),h(e,"TotalTrasladosImpuestoIVA8",n),h(e,"TotalTrasladosBaseIVA0",n),h(e,"TotalTrasladosImpuestoIVA0",n),h(e,"TotalTrasladosBaseIVAExento",n),t.push([{text:"Totales",colSpan:2,alignment:"center",bold:!0,border:[!0,!0,!1,!0]},{},{text:`Monto Total: ${i(e.get("MontoTotalPagos"))}`,colSpan:3,alignment:"center",bold:!0,border:[!1,!0,!0,!0]},{},{}]),o.length>0){const e=5-o.length;for(let t=0;t<e;t++)o.push({});t.push(o)}if(n.length>0){const e=5-n.length;for(let t=0;t<e;t++)n.push({});t.push(n)}return t};e.AbstractInvoiceData=n,e.CfdiData=class extends n{constructor(e,t,o,n,a,l,i){super(),this._comprobante=void 0,this._address=void 0;const s=e.searchNode("cfdi:Emisor");if(!s)throw new Error("El CFDI no contiene nodo emisor");const r=e.searchNode("cfdi:Receptor");if(!r)throw new Error("El CFDI no contiene nodo receptor");const d=e.searchNode("cfdi:Complemento","tfd:TimbreFiscalDigital");if(!d)throw new Error("El CFDI no contiene complemento de timbre fiscal digital");this._comprobante=e,this._emisor=s,this._receptor=r,this._timbreFiscalDigital=d,this._qrUrl=t,this._tfdSourceString=o,this._logo=n,this._address=a,this._additionalFields=l,this._additionalFieldsUP=i,0===this._qrUrl.trim().length&&this.buildUrlQr(this._comprobante)}comprobante(){return this._comprobante}address(){return this._address}},e.GenericCfdiTranslator=class{generateFooter(e,t,o,n){return{style:"tableContent",table:{widths:["auto","*","auto","auto"],body:[[{text:`Este documento es una representación impresa de un Comprobante Fiscal Digital a través de Internet versión ${e}`,style:"tableList",colSpan:4,alignment:"center"},{},{},{}],[{text:`UUID: ${t} - Página ${o} de ${n}`,style:"tableList",colSpan:4,alignment:"center"},{},{},{}]]},layout:"noBorders"}}generateTopContent(e,t){const o={columns:[{width:"*",alignment:"left",style:"tableContent",table:{widths:["*"],body:[[""]]},layout:"lightHorizontalLines"},{width:"auto",alignment:"center",style:"tableContent",table:{widths:["auto","auto"],body:[["SERIE:",{text:e.get("Serie"),style:"serieAndFolio"}],["FOLIO:",{text:e.get("Folio"),style:"serieAndFolio"}],["FECHA:",e.get("Fecha")],["EXPEDICIÓN:",e.get("LugarExpedicion")],["COMPROBANTE:",e.get("TipoDeComprobante")],["VERSIÓN:",e.get("Version")]]},layout:"lightHorizontalLines"}]};return t&&(o.columns[0].table.body[0][0]={image:t,fit:[302,90]},o.columns[0].table.widths=["*"]),o}generateEmisorContent(e){return{style:"tableContent",table:{widths:["auto","*","auto","auto"],body:[[{text:"EMISOR",style:"tableHeader",colSpan:4,alignment:"left"},{},{},{}],["NOMBRE:",e.get("Nombre"),"RFC:",e.get("Rfc")],["REGIMEN FISCAL:",{colSpan:3,text:e.get("RegimenFiscal")},{},{}]]},layout:"lightHorizontalLines"}}generateAddress(e,t){const o=[],n=[];return(t||e.offsetExists("DomicilioFiscalReceptor"))&&n.push("DOMICILIO:",`${t?t+" ":""}${e.get("DomicilioFiscalReceptor")}`),n.push("USO CFDI",{colSpan:t||e.offsetExists("DomicilioFiscalReceptor")?1:3,text:e.get("UsoCFDI")}),o.push(n),e.offsetExists("ResidenciaFiscal")&&e.offsetExists("NumRegIdTrib")&&o.push(["RESIDENCIA FISCAL:",e.get("ResidenciaFiscal"),"NUMERO ID TRIB.:",e.get("NumRegIdTrib")]),o}generateReceptorContent(e,t){const o={style:"tableContent",table:{widths:["auto","*","auto","auto"],body:[[{text:"RECEPTOR",style:"tableHeader",colSpan:4,alignment:"left"},{},{},{}],["NOMBRE:",e.get("Nombre"),"RFC:",e.get("Rfc")],...this.generateAddress(e,t)]},layout:"lightHorizontalLines"};return e.offsetExists("RegimenFiscalReceptor")&&o.table.body.push(["REGIMEN FISCAL",{colSpan:3,text:e.get("RegimenFiscalReceptor")},{},{}]),o}useGlobalInformation(e,t){const o=e.searchNode("cfdi:InformacionGlobal");void 0!==o&&(t.push({style:"tableContent",table:{widths:["*","*","*"],body:[[{text:"INFORMACIÓN GLOBAL",style:"tableHeader",colSpan:3,alignment:"left"},{},{}],[`Periodicidad: ${o.get("Periodicidad")}`,`Meses: ${o.get("Meses")}`,`Año: ${o.get("Año")}`]]},layout:"lightHorizontalLines"}),t.push("\n"))}generateGeneralInvoiceInfoContent(e){return{style:"tableContent",table:{widths:[95,"*",95,"*"],body:[[{text:"DATOS GENERALES DEL COMPROBANTE",style:"tableHeader",colSpan:4,alignment:"left"},{},{},{}],["MONEDA:",e.get("Moneda"),"FORMA PAGO:",e.get("FormaPago")],["METODO DE PAGO:",e.get("MetodoPago"),"CONDICIONES DE PAGO:",e.get("CondicionesDePago")]]},layout:"lightHorizontalLines"}}generateImpuestos(e){const t=[],o=e.searchNodes("cfdi:Impuestos","cfdi:Traslados","cfdi:Traslado"),n=e.searchNodes("cfdi:Impuestos","cfdi:Retenciones","cfdi:Retencion");if(o.length>0){t.push("Traslados");const e=o.map(e=>[e.get("Impuesto"),"Exento"===e.get("TipoFactor")?"EXENTO":i(e.get("Importe"))]);t.push({table:{body:e},layout:"noBorders"})}if(n.length>0){t.push("Retenciones");const e=n.map(e=>[e.get("Impuesto"),i(e.get("Importe"))]);t.push({table:{body:e},layout:"noBorders"})}return t}generateConceptsContent(e){const t=e.map(e=>[e.get("ClaveProdServ"),e.get("Cantidad"),e.get("ClaveUnidad"),e.get("NoIdentificacion")||"(Ninguno)",e.get("Descripcion"),i(e.get("ValorUnitario")),i(e.get("Descuento")),{colSpan:2,stack:this.generateImpuestos(e)},"",i(e.get("Importe"))]);return t.unshift(["ClaveProdServ","Cant","Clave Unidad","Identificación","Descripción","Valor Unitario","Descuento",{colSpan:2,text:"Impuesto"},"","Importe"]),{style:"tableList",table:{widths:["auto","auto","auto","auto","*","auto","auto","auto","auto","auto"],body:t},layout:{fillColor:e=>0===e?"#CCCCCC":null}}}generateCurrencyRelatedInfo(e){const t=e.searchAttribute("cfdi:Impuestos","TotalImpuestosTrasladados"),o=e.searchAttribute("cfdi:Impuestos","TotalImpuestosRetenidos"),n=e.searchNodes("cfdi:Impuestos","cfdi:Traslados","cfdi:Traslado"),a=[],s=[];if("P"!==e.get("TipoDeComprobante")&&s.push({fontSize:7,margin:[0,5,0,0],columns:[{width:"auto",text:"IMPORTE CON LETRA:",margin:[0,0,5,0]},{width:"auto",text:l(parseFloat(e.get("Total")||"0"),e.get("Moneda"))},{width:"*",text:""}]}),"3.3"===e.get("Version")){const t=e.searchNode("cfdi:CfdiRelacionados");if(t){const e=t.searchNodes("cfdi:CfdiRelacionado").map(e=>[`UUID: ${e.get("UUID")}`]);s.push({fontSize:7,margin:[0,5,0,0],table:{widths:["*"],body:[[{text:`CFDIS RELACIONADOS - TIPO RELACIÓN ${t.get("TipoRelacion")}`,fillColor:"#CCCCCC"}],...e]}})}}else{const t=e.searchNodes("cfdi:CfdiRelacionados");if(t.length>0)for(const e of t){const t=e.searchNodes("cfdi:CfdiRelacionado").map(e=>[`UUID: ${e.get("UUID")}`]);s.push({fontSize:7,margin:[0,5,0,0],table:{widths:["*"],body:[[{text:`CFDIS RELACIONADOS - TIPO RELACIÓN ${e.get("TipoRelacion")}`,fillColor:"#CCCCCC"}],...t]}})}}return a.push(s),"P"!==e.get("TipoDeComprobante")&&a.push({width:"auto",alignment:"right",style:"tableContent",margin:[10,0,0,0],table:{widths:["auto","auto"],body:[["SUBTOTAL:",{text:i(e.get("SubTotal")),fontSize:9}],["DESCUENTO:",i(e.get("Descuento"))],["SUBTOTAL T16:",i(null!=n[0]?n[0].get("Base"):0)],["SUBTOTAL T0:",i(null!=n[1]?n[1].get("Base"):0)],["TOTAL IMP. TRASLADADOS:",i(t)],["TOTAL IMP. RETENIDOS:",i(o)],[{text:"TOTAL:",fontSize:11,bold:!0},{text:i(e.get("Total")),fontSize:11,bold:!0}]]},layout:"lightHorizontalLines"}),{columns:a}}generateStampContent(e){const t=e.comprobante(),o=e.timbreFiscalDigital(),n=e.tfdSourceString(),a=e.qrUrl(),l=[];return o&&l.push([{colSpan:1,rowSpan:8,qr:a,fit:120},"",""],["","NUMERO SERIE CERTIFICADO SAT",o.get("NoCertificadoSAT")],["","NUMERO SERIE CERTIFICADO EMISOR",t.get("NoCertificado")],["","FECHA HORA CERTIFICACIÓN",o.get("FechaTimbrado")],["","FOLIO FISCAL UUID",o.get("UUID")],["","SELLO DIGITAL",s(o.get("SelloCFD"),86)],["","SELLO DEL SAT",s(o.get("SelloSAT"),86)]),l.push(["","CADENA ORIGINAL CC:",{text:s(n,86)}]),{style:"tableSat",table:{widths:["auto","auto","*"],body:l},layout:"lightHorizontalLines"}}generateContent(e){const t=e.comprobante(),o=e.emisor(),n=e.receptor(),a=t.searchNodes("cfdi:Conceptos","cfdi:Concepto"),l=e.additionalFields(),s=e.additionalFieldsUP(),r=[];return r.push(this.generateTopContent(t,e.logo())),r.push("\n"),r.push(this.generateEmisorContent(o)),r.push("\n"),s&&s.forEach(e=>{r.push({style:"tableContent",table:{widths:["*"],body:[[{text:e.title,style:"tableHeader"}],[{text:e.value,style:"infoHighlight"}]]},layout:"lightHorizontalLines"}),r.push("\n")}),r.push(this.generateReceptorContent(n,e.address())),r.push("\n"),"P"!==t.get("TipoDeComprobante")&&(this.useGlobalInformation(t,r),r.push(this.generateGeneralInvoiceInfoContent(t)),r.push("\n")),r.push(this.generateConceptsContent(a)),r.push("\n"),r.push(this.generateCurrencyRelatedInfo(t)),r.push("\n"),((e,t)=>{const o=e.searchNode("cfdi:Complemento","pago10:Pagos");if(!o)return;const n=o.searchNodes("pago10:Pago");if(n.length>0)for(const e of n){const o=e.searchNodes("pago10:DoctoRelacionado");t.push({style:"tableContent",table:{widths:[95,"*",95,"*"],body:[[{text:"INFORMACIÓN DE PAGO",style:"tableHeader",colSpan:4,alignment:"center"},{},{},{}],["FECHA:",e.get("FechaPago"),"FORMA PAGO:",e.get("FormaDePagoP")],["MONEDA:",e.get("MonedaP"),"MONTO:",i(e.get("Monto")||"0")],e.offsetExists("TipoCambioP")?["TIPO DE CAMBIO:",e.get("TipoCambioP"),"",""]:["","","",""]]},layout:"lightHorizontalLines"}),t.push("\n"),t.push({style:"tableList",table:{widths:["*","auto","auto",30,20,"auto","auto","auto"],body:u(o)},layout:{fillColor:e=>e%2!=0?"#CCCCCC":null}}),t.push("\n")}})(t,r),((e,t)=>{const o=e.searchNode("cfdi:Complemento","pago20:Pagos");if(!o)return;const n=o.searchNode("pago20:Totales"),a=o.searchNodes("pago20:Pago");if(a.length>0&&void 0!==n){t.push({style:"tableContent",table:{widths:["20%","20%","20%","20%","20%"],body:f(n)}}),t.push("\n");for(const e of a){const o=e.searchNodes("pago20:DoctoRelacionado");t.push({style:"tableContent",table:{widths:[95,"*",95,"*"],body:[[{text:"INFORMACIÓN DE PAGO",style:"tableHeader",colSpan:4,alignment:"center"},{},{},{}],["FECHA:",e.get("FechaPago"),"FORMA PAGO:",e.get("FormaDePagoP")],["MONEDA:",e.get("MonedaP"),"MONTO:",i(e.get("Monto")||"0")],e.offsetExists("TipoCambioP")?["TIPO DE CAMBIO:",e.get("TipoCambioP"),{},{}]:[{},{},{},{}]]},layout:"lightHorizontalLines"}),t.push({style:"tableList",table:{widths:["*","auto","auto",25,20,"auto","auto","auto"],body:g(o)},layout:{fillColor:e=>e%2!=0?"#CCCCCC":null}}),t.push("\n"),t.push("\n")}}})(t,r),((e,t)=>{const o=e.searchNode("cfdi:Complemento","implocal:ImpuestosLocales");if(!o)return;const n=[];n.push([{text:"COMPLEMENTO IMPUESTOS LOCALES",style:"tableHeader",colSpan:4,alignment:"center"},{},{},{}]),n.push(["TOTAL RETENCIONES:",i(o.get("TotaldeRetenciones")),"TOTAL TRASLADOS:",i(o.get("TotaldeTraslados"))]);const a=o.searchNode("implocal:RetencionesLocales");a&&n.push([{style:"tableContent",margin:3,table:{widths:["*","*","*"],body:[[{text:"RETENCIONES LOCALES",style:"tableHeader",colSpan:3,alignment:"center"},{},{}],[{text:"IMP LOCAL RETENIDO",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TASA DE RETENCIÓN",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"IMPORTE",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"}],[a.get("ImpLocRetenido"),a.get("TasadeRetencion"),i(a.get("Importe"))]]},layout:{hLineWidth:(e,t)=>0===e||e===t.table.body.length||e===t.table.headerRows?.8:.5,vLineWidth:(e,t)=>0===e||e===t.table.widths?.length?.8:0,hLineColor:(e,t)=>0===e||e===t.table.body.length?"black":"gray",paddingLeft:e=>0===e?0:8,paddingRight:(e,t)=>e===(t.table.widths?.length||0)-1?0:8},colSpan:4},{},{},{}]);const l=o.searchNode("implocal:TrasladosLocales");l&&n.push([{style:"tableContent",margin:3,table:{widths:["*","*","*"],body:[[{text:"TRASLADOS LOCALES",style:"tableHeader",colSpan:3,alignment:"center"},{},{}],[{text:"IMP LOCAL TRASLADADO",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TASA DE TRASLADO",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"IMPORTE",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"}],[l.get("ImpLocTrasladado"),l.get("TasadeTraslado"),i(l.get("Importe"))]]},layout:{hLineWidth:(e,t)=>0===e||e===t.table.body.length||e===t.table.headerRows?.8:.5,vLineWidth:(e,t)=>0===e||e===t.table.widths?.length?.8:0,hLineColor:(e,t)=>0===e||e===t.table.body.length?"black":"gray",paddingLeft:e=>0===e?0:8,paddingRight:(e,t)=>e===(t.table.widths?.length||0)-1?0:8},colSpan:4},{},{},{}]),t.push({style:"tableContent",table:{widths:[95,"*",95,"*"],body:n},layout:{hLineWidth:(e,t)=>0===e||e===t.table.body.length||e===t.table.headerRows?.8:.5,vLineWidth:(e,t)=>0===e||e===t.table.widths?.length?.8:0,hLineColor:(e,t)=>0===e||e===t.table.body.length?"black":"gray",paddingLeft:e=>0===e?0:8,paddingRight:(e,t)=>e===(t.table.widths?.length||0)-1?0:8}}),t.push("\n")})(t,r),l&&l.forEach(e=>{r.push({style:"tableContent",table:{widths:["*"],body:[[{text:e.title,style:"tableHeader"}],[{text:e.value,style:"infoHighlight"}]]},layout:"lightHorizontalLines"}),r.push("\n")}),r.push(this.generateStampContent(e)),r}translate(e,t){const o=e.comprobante(),n=e.timbreFiscalDigital();return{content:this.generateContent(e),styles:{tableHeader:{bold:!0,fontSize:10,color:"black"},infoHighlight:{fontSize:11,color:"black"},serieAndFolio:{bold:!0,fontSize:15,color:"red"},tableContent:{fontSize:8,color:"black",alignment:"left"},tableList:{fontSize:7,color:"black",alignment:"center"},tableSat:{fontSize:5,color:"black",alignment:"left"}},defaultStyle:t,footer:(e,t)=>this.generateFooter(o.get("Version"),n.get("UUID"),e,t)}}},e.GenericRetencionesTranslator=class{constructor(){this.version="1.0"}tableLayoutBordered(){return{hLineWidth:(e,t)=>0===e||e===t.table.body.length||e===t.table.headerRows?.8:.5,vLineWidth:(e,t)=>0===e||e===t.table.widths?.length?.8:0,hLineColor:(e,t)=>0===e||e===t.table.body.length?"black":"gray",paddingLeft:e=>0===e?0:8,paddingRight:(e,t)=>e===(t.table.widths?.length||0)-1?0:8}}generateFooter(e,t,o,n){return{style:"tableContent",table:{widths:["auto","*","auto","auto"],body:[[{text:`Este documento es una representación impresa de un Comprobante Fiscal Digital por Internet que ampara Retenciones e Información de Pagos versión ${e}`,style:"tableList",colSpan:4,alignment:"center"},{},{},{}],[{text:`UUID: ${t} - Página ${o} de ${n}`,style:"tableList",colSpan:4,alignment:"center"},{},{},{}]]},layout:"noBorders"}}generateTopContent(e,t){const o={columns:[{width:"*",alignment:"left",style:"tableContent",table:{widths:["*"],body:[[""]]},layout:"lightHorizontalLines"},{width:"auto",alignment:"center",style:"tableContent",table:{widths:["auto","auto"],body:[["FOLIO:",e.get("FolioInt")],["FECHA:",e.get("FechaExp")],["COMPROBANTE:","RETENCIÓN"],["VERSIÓN:",this.version]]},layout:"lightHorizontalLines"}]};return t&&(o.columns[0].table.body[0][0]={image:t,fit:[80,80]},o.columns[0].table.widths=["*"]),o}generateEmisorContent(e){const t=[];return t.push([{text:"EMISOR",style:"tableHeader",colSpan:4,alignment:"left"},{},{},{}]),t.push(["NOMBRE:",e.get("NomDenRazSocE"),"RFC:",e.get("1.0"===this.version?"RFCEmisor":"RfcE")]),"2.0"===this.version&&t.push(["REGIMEN FISCAL:",e.get("RegimenFiscalE"),"",""]),{style:"tableContent",table:{widths:["auto","*","auto","auto"],body:t},layout:this.tableLayoutBordered()}}generateReceptorContent(e){const t=e.get("1.0"===this.version?"Nacionalidad":"NacionalidadR"),o=[];let n="";if("Nacional"===t){const t=e.searchNode("retenciones:Nacional");t&&(o.push("NOMBRE:",t.get("NomDenRazSocR"),"RFC:",t.get("1.0"===this.version?"RFCRecep":"RfcR")),n=t.get("DomicilioFiscalR"))}else{const t=e.searchNode("retenciones:Extranjero");t&&o.push("NOMBRE:",t.get("NomDenRazSocR"),"NUM. REG. ID TRIB.:",t.get("1.0"===this.version?"NumRegIdTrib":"NumRegIdTribR"))}const a=[];return a.push([{text:"RECEPTOR",style:"tableHeader",colSpan:4,alignment:"left"},{},{},{}]),a.push(["NACIONALIDAD:",t,"2.0"===this.version&&"Nacional"===t?"DOMICILIO FISCAL:":"","2.0"===this.version&&"Nacional"===t?n:""]),a.push(o),{style:"tableContent",table:{widths:["auto","*","auto","auto"],body:a},layout:this.tableLayoutBordered()}}generatePeriodoContent(e,t){return{style:"tableContent",table:{widths:["*","*","*","*"],body:[[{text:"PERIODO MES INICIAL",style:"tableHeader",alignment:"left"},{text:"PERIODO MES FINAL",style:"tableHeader",alignment:"left"},{text:"PERIODO EJERCICIO ANUAL",style:"tableHeader",alignment:"left"},{text:"TIPO DE RETENCION",style:"tableHeader",alignment:"left"}],[e.get("MesIni"),e.get("MesFin"),e.get("1.0"===this.version?"Ejerc":"Ejercicio"),t]]},layout:this.tableLayoutBordered()}}generateImpuestosRetenidos(e){const t=[];return e.length>0&&(t.push([{text:"IMPUESTOS RETENIDOS",style:"tableHeader",colSpan:3,alignment:"center"},{},{}]),t.push([{text:"TIPO DE IMPUESTO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"TIPO DE PAGO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"MONTO RETENIDO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}])),e.forEach(e=>{t.push([e.get("1.0"===this.version?"Impuesto":"ImpuestoRet"),e.get("TipoPagoRet"),i(e.get("1.0"===this.version?"montoRet":"MontoRet"))])}),t}generateTotales(e){const t=e.searchNodes("retenciones:ImpRetenidos"),o=this.generateImpuestosRetenidos(t);return{style:"tableContent",table:{widths:["*","*","*","*"],body:[[{text:"TOTALES",style:"tableHeader",colSpan:4,alignment:"center"},{},{},{}],[{text:"MONTO TOTAL DE OPERACIÓN",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"MONTO TOTAL GRAVADO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"MONTO TOTAL EXENTO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"MONTO TOTAL RETENIDO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}],[i(e.get("1.0"===this.version?"montoTotOperacion":"MontoTotOperacion")),i(e.get("1.0"===this.version?"montoTotGrav":"MontoTotGrav")),i(e.get("1.0"===this.version?"montoTotExent":"MontoTotExent")),i(e.get("1.0"===this.version?"montoTotRet":"MontoTotRet"))],[{style:"tableContent",margin:5,colSpan:4,table:{widths:["*","*","*"],body:o},layout:this.tableLayoutBordered()},{},{},{}]]},layout:this.tableLayoutBordered()}}generateStampContent(e){const t=e.retenciones(),o=e.timbreFiscalDigital(),n=o.get("1.0"===this.version?"version":"Version"),a=e.tfdSourceString(),l=e.qrUrl(),i=[];return o&&i.push([{colSpan:1,rowSpan:8,qr:l,fit:100},"",""],["","NUMERO SERIE CERTIFICADO SAT",o.get("1.0"===n?"noCertificadoSAT":"NoCertificadoSAT")],["","NUMERO SERIE CERTIFICADO EMISOR",t.get("1.0"===this.version?"NumCert":"NoCertificado")],["","FECHA HORA CERTIFICACIÓN",o.get("FechaTimbrado")],["","FOLIO FISCAL UUID",o.get("UUID")],["","SELLO DIGITAL",s(o.get("1.0"===n?"selloCFD":"SelloCFD"),86)],["","SELLO DEL SAT",s(o.get("1.0"===n?"selloSAT":"SelloSAT"),86)]),i.push(["","CADENA ORIGINAL CC:",{text:s(a,86)}]),{style:"tableSat",table:{widths:["auto","auto","*"],body:i},layout:"lightHorizontalLines"}}contentService(e){const t=[];t.push([{text:"FORMA DE PAGO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"TIPO DE SERVICIO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"FECHA DE PAGO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"PRECIO DE SERVICIO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}]),t.push([e.get("FormaPagoServ"),e.get("TipoDeServ"),e.get("FechaServ"),i(e.get("PrecioServSinIVA"))]),(e.offsetExists("SubTipServ")||e.offsetExists("RFCTerceroAutorizado"))&&(t.push([{text:"SUBTIPO DE SERVICIO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"RFC TERCERO AUTORIZADO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},"",""]),t.push([e.get("SubTipServ"),e.get("RFCTerceroAutorizado"),"",""]));const o=e.searchNode("plataformasTecnologicas:ImpuestosTrasladadosdelServicio"),n=e.searchNode("plataformasTecnologicas:ContribucionGubernamental"),a=e.searchNode("plataformasTecnologicas:ComisionDelServicio");return o&&t.push([{style:"tableContent",margin:3,table:{widths:["*","*","*","*","*"],body:[[{text:"IMPUESTOS TRASLADADOS DEL SERVICIO",style:"tableHeader",colSpan:5,alignment:"center"},{},{},{},{}],[{text:"IMPUESTO BASE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"IMPUESTO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"TIPO FACTOR",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"TASA O CUOTA",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"IMPORTE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}],[i(o.get("Base")),o.get("Impuesto"),o.get("TipoFactor"),o.get("TasaCuota"),i(o.get("Importe"))]]},layout:this.tableLayoutBordered(),colSpan:4},{},{},{}]),n&&t.push([{style:"tableContent",margin:3,table:{widths:["*","*"],body:[[{text:"CONTRIBUCIÓN GUBERNAMENTAL",style:"tableHeader",colSpan:2,alignment:"center"},{}],[{text:"ESTADO",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"IMPORTE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}],[n.get("EntidadDondePagaLaContribucion"),i(n.get("ImpContrib"))]]},layout:this.tableLayoutBordered(),colSpan:4},{},{},{}]),a&&t.push([{style:"tableContent",margin:3,table:{widths:["*","*","*"],body:[[{text:"COMISIÓN DEL SERVICIO",style:"tableHeader",colSpan:3,alignment:"center"},{},{}],[{text:"BASE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"PORCENTAJE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"},{text:"IMPORTE",style:"tableSubHeader",fillColor:"#eeeeff",alignment:"left"}],[i(a.get("Base")),a.get("Porcentaje"),i(a.get("Importe"))]]},layout:this.tableLayoutBordered(),colSpan:4},{},{},{}]),t}generateContentPerService(e){const t=[];return t.push([{text:"SERVICIOS",style:"tableHeader",alignment:"center"}]),e.forEach(e=>{t.push([{margin:5,style:"tableContent",table:{widths:["*","*","*","*"],body:this.contentService(e)},layout:this.tableLayoutBordered()}])}),t}generatePlataformasTecnologicas(e){const t=e.searchNodes("plataformasTecnologicas:Servicios","plataformasTecnologicas:DetallesDelServicio"),o=[];return o.push([{text:"SERVICIO MEDIANTE PLATAFORMAS TECNOLÓGICAS",style:"tableHeader",colSpan:5,alignment:"center"},{},{},{},{}]),o.push([{text:"VERSION",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"PERIODICIDAD",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"NUMERO SERVICIOS",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"SUBTOTAL OPERACIONES",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TOTAL IVA",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"}]),o.push([e.get("Version"),e.get("Periodicidad"),e.get("NumServ"),i(e.get("MonTotServSIVA")),i(e.get("TotalIVATrasladado"))]),o.push([{text:"TOTAL IVA RETENIDO",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TOTAL ISR RETENIDO",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"DIFERENCIA IVA",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TOTAL USO DE PLATAFORMA",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"},{text:"TOTAL CONTRIBUCIÓN GUBERNAMENTAL",fillColor:"#eeeeff",style:"tableSubHeader",alignment:"left"}]),o.push([i(e.get("TotalIVARetenido")),i(e.get("TotalISRRetenido")),i(e.get("DifIVAEntregadoPrestServ")),i(e.get("MonTotalporUsoPlataforma")),""!==e.get("MonTotalContribucionGubernamental")?i(e.get("MonTotalContribucionGubernamental")):""]),t.length>0&&o.push([{style:"tableContent",margin:3,table:{widths:["*"],body:this.generateContentPerService(t)},layout:this.tableLayoutBordered(),colSpan:5},{},{},{},{}]),{style:"tableContent",table:{widths:["*","*","*","*","*"],body:o},layout:this.tableLayoutBordered()}}generateContent(e){const t=e.retenciones(),o=e.emisor(),n=e.receptor(),a=e.periodo(),l=e.totales(),i=e.additionalFields(),s=t.searchNode("retenciones:Complemento","plataformasTecnologicas:ServiciosPlataformasTecnologicas"),r=[];return r.push(this.generateTopContent(t,e.logo())),r.push("\n"),r.push(this.generateEmisorContent(o)),r.push("\n"),r.push(this.generateReceptorContent(n)),r.push("\n"),r.push("\n"),r.push(this.generatePeriodoContent(a,t.get("CveRetenc"))),r.push("\n"),r.push(this.generateTotales(l)),r.push("\n"),s&&(r.push(this.generatePlataformasTecnologicas(s)),r.push("\n")),i&&i.forEach(e=>{r.push({style:"tableContent",table:{widths:["*"],body:[[{text:e.title,style:"tableHeader"}],[e.value]]},layout:"lightHorizontalLines"}),r.push("\n")}),r.push(this.generateStampContent(e)),r}translate(e,t){const o=e.retenciones(),n=e.timbreFiscalDigital();return this.version=o.get("Version"),{content:this.generateContent(e),styles:{tableHeader:{bold:!0,fontSize:10,color:"black"},tableSubHeader:{bold:!0,fontSize:9,color:"black"},tableContent:{fontSize:8,color:"black",alignment:"left"},tableList:{fontSize:7,color:"black",alignment:"center"},tableSat:{fontSize:5,color:"black",alignment:"left"}},defaultStyle:t,footer:(e,t)=>this.generateFooter(this.version,n.get("UUID"),e,t)}}},e.PdfMakerBrowserBuilder=class{constructor(e,t){this._documentTranslator=void 0,this._defaultStyle=void 0,this._documentTranslator=e,t||(t={font:"Roboto"}),this._defaultStyle=t}build(e,t){return console.warn("This method not permitted on browser"),Promise.reject("Method not work on browser")}buildBase64(e){return new Promise((t,o)=>{try{const o=this.buildPdf(e);c().createPdf(o).getBase64(e=>{t(e)})}catch(e){o(e)}})}buildPdf(e){return this._documentTranslator.translate(e,this._defaultStyle)}},e.PdfMakerBuilder=class{constructor(e,t){this._documentTranslator=void 0,this._defaultStyle=void 0,this._documentTranslator=e,t||(t={font:"Roboto"}),this._defaultStyle=t}build(e,t){return new Promise((o,n)=>{const a=require("fs"),l=this.buildPdf(e),i=c().createPdfKitDocument(l,{}),s=a.createWriteStream(t);s.on("error",e=>(s.end(),n(e))),i.pipe(s),i.on("end",()=>o()),i.on("error",e=>n(e)),i.end()})}buildBase64(e){return new Promise((t,o)=>{const n=this.buildPdf(e),a=c().createPdfKitDocument(n,{}),l=[];a.on("data",e=>{l.push(e)}),a.on("end",()=>t(Buffer.concat(l).toString("base64"))),a.on("error",e=>o(e)),a.end()})}buildPdf(e){return this._documentTranslator.translate(e,this._defaultStyle)}},e.RetencionesData=class extends n{constructor(e,t,o,n,a,l){super(),this._retenciones=void 0,this._periodo=void 0,this._totales=void 0;const i=e.searchNode("retenciones:Emisor");if(!i)throw new Error("La factura de retenciones no contiene nodo emisor");const s=e.searchNode("retenciones:Receptor");if(!s)throw new Error("La factura de retenciones no contiene nodo receptor");const r=e.searchNode("retenciones:Periodo");if(!r)throw new Error("La factura de retenciones no contiene nodo periodo");const d=e.searchNode("retenciones:Totales");if(!d)throw new Error("La factura de retenciones no contiene nodo totales");const c=e.searchNode("retenciones:Complemento","tfd:TimbreFiscalDigital");if(!c)throw new Error("La factura de retenciones no contiene complemento de timbre fiscal digital");this._retenciones=e,this._emisor=i,this._receptor=s,this._periodo=r,this._totales=d,this._timbreFiscalDigital=c,this._qrUrl=t,this._tfdSourceString=o,this._logo=n,this._additionalFields=a,this._additionalFieldsUP=l,0===this._qrUrl.trim().length&&this.buildUrlQr(this._retenciones)}retenciones(){return this._retenciones}periodo(){return this._periodo}totales(){return this._totales}},e.breakEveryNCharacters=s,e.formatCurrency=i,e.getPdfMake=c,e.installPdfMake=e=>{d=e},e.toCurrency=l});
//# sourceMappingURL=cfdi-to-pdf.umd.js.map
