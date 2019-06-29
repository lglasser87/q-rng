let load, qrn;

function _prng(seed) {
    return seed * 16807 % 2147483647 / 2147483647;
}

function _request(min, max) {
    clearInterval(load);
    load = setInterval(function() {
        document.getElementById("rn").innerHTML = Math.floor(Math.random() * (max - min + 1)) + min;
    }, 100);
    if (navigator.onLine === false) {
        let prn = Math.floor(Math.random() * 32768) + 1;
        if (qrn) {
            prn = _prng(prn * qrn);
        }
        else {
            prn = _prng(prn);
        }
        setTimeout(function() {
            clearInterval(load);
            document.getElementById("rn").innerHTML = Math.floor(rn * (max - min) + min);
        }, 300);
        document.getElementById("rn").title = "No internet connection: PRNG";
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                qrn = JSON.parse(this.responseText).data[0];
                clearInterval(load);
                document.getElementById("rn").innerHTML = Math.round(qrn / 65535 * (max - min) + min);
                document.getElementById("rn").title = "Internet connection: QRNG";
            }
        };
        xhttp.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16", true);
        xhttp.send();
    }
}

function _check(min, max) {
    if (isNaN(min)) {
        min = 0;
    }
    if (isNaN(max)) {
        max = 0;
    }
    if (min === max) {
        document.getElementById("rn").innerHTML = min;
        return;
    }
    if (min > max) {
        let t = min;
        min = max;
        max = t;
        document.getElementById("min").value = min;
        document.getElementById("max").value = max;
    }
    if (max - min > 65535) {
        document.getElementById("rn").innerHTML = "&#128565;";
        return;
    }
    return [min, max];
}

function setQRN() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = _check(min, max);
    if (vals) {
        min = vals[0];
        max = vals[1];
        _request(min, max);
    }
}

document.getElementById("gen").onclick = setQRN;

setQRN();