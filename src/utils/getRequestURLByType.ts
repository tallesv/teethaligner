export default function getRequestURLByType(productName: string) {
  switch (productName) {
    case 'Setup':
      return `/products/setup`;
    case 'Alinhadores - Programação TeethAligner':
      return `/products/alinhadores/programacao-teethaligner`;
    case 'Alinhadores - Apenas Imprimir':
      return `/products/alinhadores/apenas-imprimir`;
    case 'Moldagem de Transferência Virtual':
      return `/products/transferencia-virtual`;
    case 'Modelos/Guias Cirúrgicos':
      return `/products/guias-cirurgicos`;
    case 'Contenção':
      return 'products/contencao';
    default:
      return '';
  }
}
