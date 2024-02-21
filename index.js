const snarkjs = require("snarkjs");
const attack = require("snarkjs-exploit");
const fs = require("fs");

async function honest_prover(p, q) {
    const {proof, publicSignals} = await snarkjs.plonk.fullProve({p, q}, "build/circuit_js/circuit.wasm", "build/circuit_final.zkey");
    return {proof, publicSignals};
};

async function dishonest_prover(n) {
    const p = 1; // Just choose arbitrary p and q
    const q = 1;
    const result = await attack.plonk.fullFakeProve({p, q}, "build/circuit_js/circuit.wasm", "build/circuit_final.zkey", [n]);
    const fake_proof = result.proof;
    const publicSignals = result.publicSignals;
    return {fake_proof, publicSignals};
}

async function verifier(proof, publicSignals) {
    const vKey = JSON.parse(fs.readFileSync("build/verification_key.json"));
    const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
};

(async function () {
    const n = '134076760730711240930804020527264645236231310064852953932663948219307639496184942246750744817268988522520217190182742887917499616365046477502446205167519765037670414323119865477603219816497110655727521092337913569575973698051841014953636345272419924018449714718746069992171514923595182811076342661205568860571';
    let p = '13249593605171571044875087518526471323684264884959691968918633023798734792478602839278952022489286803414057123931616815852072994103402720546468557627030147';
    let q = '10119311182373058161267891780691576970852197432262528095195026249551250848377430023824530094370911041170515341954868665938176068124645182695907576597782793';
    const { proof, publicSignals } = await honest_prover(p, q);
    console.log("proof", proof);
    await verifier(proof, publicSignals);

    const {fake_proof, _} = await dishonest_prover(n);
    console.log("fake_proof", fake_proof);
    await verifier(fake_proof, [n]);
})();