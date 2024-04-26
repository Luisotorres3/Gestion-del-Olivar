class Finca {
  constructor() {
    this.altura = 0;
    this.frutas = [];
  }

  crecer() {
    this.altura++;
  }

  producirFrutas() {
    const nuevaFruta = `Fruta ${this.frutas.length + 1}`;
    this.frutas.push(nuevaFruta);
  }
}
