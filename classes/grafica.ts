export class GraficaData {
  private meses: string[] = ["enero", "febrero", "marzo", "abril"];
  private valores: number[] = [0, 0, 0, 0];
  public dataCantidad: any;
  constructor() {}
  getDataGrafica() {
    this.dataCantidad = {
      datasets: [
        {
          data: this.valores,
          label: "Ventas",
        },
      ],
    };
    return this.dataCantidad;
  }

  incrementarValores(mes: string, valor: number) {
    mes = mes.toLowerCase().trim();
    //todo usamos este for
    for (let i in this.meses) {
      if (this.meses[i] === mes) {
        this.valores[i] += valor;
      }
    }

    return this.getDataGrafica();
  }
}
