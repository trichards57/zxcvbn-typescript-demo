export interface CrackTimesDisplay {
  online_throttling_100_per_hour?: string;
  online_no_throttling_10_per_second?: string;
  offline_slow_hashing_1e4_per_second?: string;
  offline_fast_hashing_1e10_per_second?: string;
}

export class GuessTimesElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "guess-times-template",
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  set data(value: CrackTimesDisplay) {
    if (!this.shadowRoot) return;

    this.setTextContent(
      '[data-field="online_throttling_100_per_hour"]',
      value.online_throttling_100_per_hour,
    );
    this.setTextContent(
      '[data-field="online_no_throttling_10_per_second"]',
      value.online_no_throttling_10_per_second,
    );
    this.setTextContent(
      '[data-field="offline_slow_hashing_1e4_per_second"]',
      value.offline_slow_hashing_1e4_per_second,
    );
    this.setTextContent(
      '[data-field="offline_fast_hashing_1e10_per_second"]',
      value.offline_fast_hashing_1e10_per_second,
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
