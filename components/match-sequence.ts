import type { IAnyMatch } from "zxcvbn-typescript";

export class MatchSequenceElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "match-sequence-template"
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      const container = template.content.cloneNode(true) as DocumentFragment;
      this.shadowRoot.appendChild(container);
    }
  }

  set data(matches: IAnyMatch[]) {
    if (!this.shadowRoot) return;

    const container = this.shadowRoot.querySelector(
      '[data-container="matches"]'
    );
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Create a match item for each match
    for (const match of matches) {
      const matchItemTemplate = document.getElementById(
        "match-item-template"
      ) as HTMLTemplateElement;
      if (!matchItemTemplate) continue;

      const matchItem = matchItemTemplate.content.cloneNode(
        true
      ) as DocumentFragment;

      // Set basic properties
      this.setTextInFragment(matchItem, '[data-field="token"]', match.token);
      this.setTextInFragment(
        matchItem,
        '[data-field="pattern"]',
        match.pattern
      );
      this.setTextInFragment(
        matchItem,
        '[data-field="guesses_log10"]',
        match.guesses_log10?.toString() || ""
      );

      // Conditionally show sections based on match type
      this.handleBruteforce(matchItem, match);
      this.handleDictionary(matchItem, match);
      this.handleSpatial(matchItem, match);
      this.handleRepeat(matchItem, match);
      this.handleSequence(matchItem, match);
      this.handleRegex(matchItem, match);
      this.handleDate(matchItem, match);

      container.appendChild(matchItem);
    }
  }

  private handleBruteforce(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "bruteforce") return;

    const section = fragment.querySelector('[data-section="bruteforce"]');
    if (match.cardinality) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="cardinality"]',
        match.cardinality.toString()
      );
      this.setTextInFragment(
        fragment,
        '[data-field="length"]',
        match.length?.toString() || ""
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleDictionary(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "dictionary") return;

    const section = fragment.querySelector('[data-section="dictionary"]');
    if (match.rank) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="dictionary_name"]',
        match.dictionary_name || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="rank"]',
        match.rank.toString()
      );
      this.setTextInFragment(
        fragment,
        '[data-field="reversed"]',
        match.reversed?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="base_guesses"]',
        match.base_guesses?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="uppercase_variations"]',
        match.uppercase_variations?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="l33t_variations"]',
        match.l33t_variations?.toString() || ""
      );

      // Handle l33t subsection
      const l33tSection = fragment.querySelector('[data-section="l33t"]');
      if (match.l33t) {
        l33tSection?.removeAttribute("hidden");
        this.setTextInFragment(
          fragment,
          '[data-field="sub_display"]',
          match.sub_display || ""
        );
        this.setTextInFragment(
          fragment,
          '[data-field="matched_word"]',
          match.matched_word || ""
        );
      } else {
        l33tSection?.setAttribute("hidden", "");
      }
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleSpatial(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "spatial") return;

    const section = fragment.querySelector('[data-section="spatial"]');
    if (match.graph) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(fragment, '[data-field="graph"]', match.graph);
      this.setTextInFragment(
        fragment,
        '[data-field="turns"]',
        match.turns?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="shifted_count"]',
        match.shifted_count?.toString() || ""
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleRepeat(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "repeat") return;

    const section = fragment.querySelector('[data-section="repeat"]');
    if (match.base_token) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="base_token"]',
        match.base_token
      );
      this.setTextInFragment(
        fragment,
        '[data-field="base_guesses_repeat"]',
        match.base_guesses?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="repeat_count"]',
        match.repeat_count?.toString() || ""
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleSequence(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "sequence") return;

    const section = fragment.querySelector('[data-section="sequence"]');
    if (match.sequence_name) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="sequence_name"]',
        match.sequence_name
      );
      this.setTextInFragment(
        fragment,
        '[data-field="sequence_space"]',
        match.sequence_space?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="ascending"]',
        match.ascending?.toString() || ""
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleRegex(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "regex") return;

    const section = fragment.querySelector('[data-section="regex"]');
    if (match.regex_name) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="regex_name"]',
        match.regex_name
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private handleDate(fragment: DocumentFragment, match: IAnyMatch) {
    if (match.pattern !== "date") return;

    const section = fragment.querySelector('[data-section="date"]');
    if (match.day) {
      section?.removeAttribute("hidden");
      this.setTextInFragment(
        fragment,
        '[data-field="day"]',
        match.day.toString()
      );
      this.setTextInFragment(
        fragment,
        '[data-field="month"]',
        match.month?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="year"]',
        match.year?.toString() || ""
      );
      this.setTextInFragment(
        fragment,
        '[data-field="separator"]',
        match.separator || ""
      );
    } else {
      section?.setAttribute("hidden", "");
    }
  }

  private setTextInFragment(
    fragment: DocumentFragment,
    selector: string,
    value: string
  ) {
    const el = fragment.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  }
}

customElements.define("match-sequence", MatchSequenceElement);
