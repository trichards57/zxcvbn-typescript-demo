import zxcvbn, { type IZXCVBNResult } from "zxcvbn-typescript";
import "../components/index";

const test_passwords = `\
zxcvbn
qwER43@!
Tr0ub4dour&3
correcthorsebatterystaple
coRrecth0rseba++ery9.23.2007staple$

p@ssword
p@$$word
123456
123456789
11111111
zxcvbnm,./
love88
angel08
monkey13
iloveyou
woaini
wang
tianya
zhang198822
li4478
a6a4Aa8a
b6b4Bb8b
z6z4Zz8z
aiIiAaIA
zxXxZzXZ
pässwörd
alpha bravo charlie delta
a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9
a b c 1 2 3
correct-horse-battery-staple
correct.horse.battery.staple
correct,horse,battery,staple
correct~horse~battery~staple
WhyfaultthebardifhesingstheArgives’harshfate?
Eupithes’sonAntinousbroketheirsilence
Athena lavished a marvelous splendor
buckmulliganstenderchant
seethenthatyewalkcircumspectly
LihiandthepeopleofMorianton
establishedinthecityofZarahemla
!"£$%^&*()

D0g..................
abcdefghijk987654321
neverforget13/3/1997
1qaz2wsx3edc

temppass22
briansmith
briansmith4mayor
password1
viking
thx1138
ScoRpi0ns
do you know

ryanhunter2000
rianhunter2000

asdfghju7654rewq
AOEUIDHG&*()LS_

12345678
defghi6789

rosebud
Rosebud
ROSEBUD
rosebuD
ros3bud99
r0s3bud99
R0$38uD99

verlineVANDERMARK

eheuczkqyq
rWibMFACxAUGZmxhVncy
Ba9ZyWABu99[BK#6MBgbH88Tofv)vs$w\
`;

function round_to_x_digits(n: number, x: number) {
  return Math.round(n * 10 ** x) / 10 ** x;
}

function round_logs(r: IZXCVBNResult) {
  r.guesses_log10 = round_to_x_digits(r.guesses_log10, 5);
  return r.sequence.map((m) => {
    const { guesses_log10, ...rest } = m;

    return {
      guesses_log10: round_to_x_digits(guesses_log10 || 0, 5),
      ...rest,
    };
  });
}

const results_lst: IZXCVBNResult[] = [];
for (const password of test_passwords.split("\n").filter((c) => c)) {
  const t0 = performance.now();
  const r = zxcvbn(password);
  const t1 = performance.now();
  round_logs(r);

  results_lst.push({
    ...r,
    calc_time: t1 - t0,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  if (resultsContainer) {
    for (const result of results_lst) {
      const passwordResult = document.createElement(
        "password-result",
      ) as HTMLElement & { data: IZXCVBNResult };
      passwordResult.data = result;
      resultsContainer.appendChild(passwordResult);
    }
  }
});

let last_q = "";
const _listener = () => {
  const searchBarEl = document.getElementById("search-bar") as HTMLInputElement;
  if (!searchBarEl) return;
  const current = searchBarEl.value || "";
  if (!current) return;
  const searchResultsContainer = document.getElementById("search-results");

  if (!searchResultsContainer) return;

  if (!current) {
    searchResultsContainer.innerHTML = "";
    return;
  }

  if (current !== last_q) {
    last_q = current;
    const t0 = performance.now();
    const r = zxcvbn(current);
    const t1 = performance.now();
    round_logs(r);

    const res: IZXCVBNResult = {
      ...r,
      calc_time: t1 - t0,
    };

    searchResultsContainer.innerHTML = "";
    const passwordResult = document.createElement(
      "password-result",
    ) as HTMLElement & { data: IZXCVBNResult };
    passwordResult.data = res;
    searchResultsContainer.appendChild(passwordResult);
  }
};

setInterval(_listener, 100);
