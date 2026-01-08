import { IZXCVBNResult } from "zxcvbn-typescript";

export class GuessTimesElement extends HTMLElement {
  private _data: IZXCVBNResult["crack_times_display"] | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "guess-times-template"
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.updateDisplay();
  }

  set data(value: IZXCVBNResult["crack_times_display"]) {
    this._data = value;

    this.updateDisplay();
  }

  private updateDisplay() {
    if (!this.shadowRoot) return;
    if (!this._data) return;

    this.setTextContent(
      '[data-field="online_throttling_100_per_hour"]',
      this._data.online_throttling_100_per_hour
    );
    this.setTextContent(
      '[data-field="online_no_throttling_10_per_second"]',
      this._data.online_no_throttling_10_per_second
    );
    this.setTextContent(
      '[data-field="offline_slow_hashing_1e4_per_second"]',
      this._data.offline_slow_hashing_1e4_per_second
    );
    this.setTextContent(
      '[data-field="offline_fast_hashing_1e10_per_second"]',
      this._data.offline_fast_hashing_1e10_per_second
    );
  }

  private setTextContent(selector: string, value: string | undefined) {
    const el = this.shadowRoot?.querySelector(selector);
    if (el) {
      el.textContent = value ?? "";
    }
  }
}

customElements.define("guess-times", GuessTimesElement);
