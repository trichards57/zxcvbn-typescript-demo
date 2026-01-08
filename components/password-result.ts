import type { IZXCVBNResult } from "zxcvbn-typescript";

export class PasswordResult extends HTMLElement {
  private _data: IZXCVBNResult | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "password-result-template"
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.updateDisplay();
  }

  set data(value: IZXCVBNResult) {
    this._data = value;

    this.updateDisplay();
  }

  private updateDisplay() {
    if (!this.shadowRoot) return;
    if (!this._data) return;

    // Set basic fields
    this.setTextContent('[data-field="password"]', this._data.password);
    this.setTextContent(
      '[data-field="guesses_log10"]',
      this._data.guesses_log10.toString()
    );
    this.setTextContent('[data-field="score"]', this._data.score.toString());
    this.setTextContent(
      '[data-field="calc_time"]',
      this._data.calc_time?.toString() || ""
    );

    // Set guess times
    const guessTimesEl = this.shadowRoot.querySelector("guess-times");
    if (guessTimesEl) {
      (guessTimesEl as GuessTimesElement).data = this._data.crack_times_display;
    }

    // Set feedback
    const feedbackEl = this.shadowRoot.querySelector("feedback-display");
    if (feedbackEl) {
      (feedbackEl as FeedbackDisplayElement).data = this._data.feedback;
    }

    // Set match sequence
    const sequenceEl = this.shadowRoot.querySelector("match-sequence");
    if (sequenceEl) {
      (sequenceEl as MatchSequenceElement).data = this._data.sequence;
    }
  }

  private setTextContent(selector: string, value: string) {
    const el = this.shadowRoot?.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  }
}

import type { FeedbackDisplayElement } from "./feedback-display";
// Import types for TypeScript
import type { GuessTimesElement } from "./guess-times";
import type { MatchSequenceElement } from "./match-sequence";

customElements.define("password-result", PasswordResult);
