import colors from "colors";
export class Log {
  /**
   * @param {string} text
   * @param {string} color
   * @param {string} type
   */
  write(text, color = "white", type = "info") {
    console[type](colors[color](text));
  }
}