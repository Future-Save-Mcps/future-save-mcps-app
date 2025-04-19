const n=(r,t="NGN")=>new Intl.NumberFormat("en-NG",{style:"currency",currency:t,minimumFractionDigits:2,maximumFractionDigits:2}).format(r);export{n as f};
