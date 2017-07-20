this.calculateNow();
var negativeDiff = "0.00";

function parser(s) {
    s = s.toString().replace(/[^0-9\.]+/g, "");
    s = parseFloat(s);
    return s;
}

function toCurrency(n) {
    n = n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return n;
}

function formatValues(v) {
    return parser(getField(v).value.toString());
}

function sum() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum = sum + formatValues(arguments[i]);
    }
    return toCurrency(sum);
}

function hasBalloon() {
    if (formatValues("LoanCalcOutput.Balloon") > 0) {
        return event.value = "1";
    }
    return;
}

function diff() {

    var diff = formatValues(arguments[0]);
    negativeDiff = "0.00";
    for (var i = 0; i < arguments.length - 1; i++) {
        diff = diff - formatValues(arguments[i + 1]);
    }
    if (diff < 0) {
        negativeDiff = toCurrency(parser(diff));
        return "0.00";
    } else {
        return toCurrency(diff);
    }
}

function diff() {

    var diff = formatValues(arguments[0]);
    negativeDiff = "0.00";
    for (var i = 0; i < arguments.length - 1; i++) {
        diff = diff - formatValues(arguments[i + 1]);
        return toCurrency(diff);
    }
}

function returnDiff(x, y) {
    diff(x, y);
    return negativeDiff;
}

function NullCheck(s) {
    Lock(s);
    if (getField(s).value == "" || getField(s).value == null || getField(s).value == undefined) {
        getField(s).value = "0.00";
    }
}

function NACheck(s) {
    Lock(s);
    if (getField(s).value == "" || getField(s).value == null || getField(s).value == undefined) {
        getField(s).value = "N/A";
    }
}


function NegativeCheck(s) {
    if (parseFloat(getField(s).value) < 0) {
        event.value = "0.00";
    }
}

function paymentsDue(a, d) {
    if (a != "" || a != null || a != undefined) {
        var paymentString = "$" + getField(a).value + " due on " + getField(d).value + "; ";
        return paymentString;
    }
}

function checkIf(v, c) {
    if (getField(v).value != "") {
        getField(c).checkThisBox(0, true);
    } else {
        getField(c).checkThisBox(0, false);
    }
}

function AH() {
    if (getField("LoanInRecord.AHCode").value == "NoAH") {
        getField("CreditDisability.None").checkThisBox(0, true);
        getField("LoanCalcOutput.AHPremium").value = "0.00";
        getField("LoanCalcOutput.AHTerm").value = "";
        getField("AH.Buyer.fullName").value = "";
        getField("AH.CoBuyer.fullName").value = "";
    } else if (getField("LoanInRecord.AHCode").value == "SingleAH") {
        getField("CreditDisability.Single").checkThisBox(0, true);
    } else if (getField("LoanInRecord.AHCode").value == "JointAH") {
        getField("CreditDisability.Joint").checkThisBox(0, true);
        getField("AH.Buyer.fullName").value = "";
        getField("AH.CoBuyer.fullName").value = " &    " + getField("CoBuyer.fullName").value;
    }
}

function LifeIns() {
    if (getField("LoanInRecord.LifeCode").value == "NoLife") {
        getField("CreditLife.None").checkThisBox(0, true);
        getField("LoanCalcOutput.DLPremium").value = "0.00";
        getField("LoanCalcOutput.DLTerm").value = "";
        getField("Life.Buyer.fullName").value = "";
        getField("Life.CoBuyer.fullName").value = "";
    } else if (getField("LoanInRecord.LifeCode").value == "SingleLife") {
        getField("CreditLife.Single").checkThisBox(0, true);
    } else if (getField("LoanInRecord.LifeCode").value == "JointLife") {
        getField("CreditLife.Joint").checkThisBox(0, true);
        getField("Life.Buyer.fullName").value = "";
        getField("Life.CoBuyer.fullName").value = " &    " + getField("CoBuyer.fullName").value;
    }
}

function PaymentSchedule() {
    var numpayments = parseInt(getField("numDefPmts").value);
    if (formatValues("numDefPmts") > 1) {
        getField("defferDown.amount.payment.").value = "";
        var paymentString = (getField("defferDown.payment").value + " due on " + getField("defferDown.dueDate").value + ";  ");
        for (var i = 2; i <= numpayments; i++) {
            paymentString = paymentString + (getField(("defferDown" + (i).toString() + ".payment")).value + " due on " + getField(("defferDown" + (i).toString() + ".dueDate")).value + ";");
        }
        event.value = paymentString;
    } else if (getField("numDefPmts").value == "" || getField("numDefPmts").value == null || getField("numDefPmts").value == undefined) {
        event.value = "";
    } else {
        event.value = "Due on " + getField("defferDown.dueDate").value + ";";
    }
}

function FirstPayment() {
    var paymentSchedule = ("Beginning on " + getField("Deal.FirstPaymentDate").value + " and continuing " + getField("Deal.FirstPaymentDate").value + " thereafter.");
    event.value = "Beginning on " + getField("Deal.FirstPaymentDate").value + " and continuing " + getField("LoanInRecord.PaymentFrequency").value + " thereafter.";
}

function BalloonPayment() {
    if (formatValues("LoanCalcOutput.Balloon") > 0 || getField("LoanCalcOutput.Balloon").value != "") {
        event.value = "Final payment due on " + getField("LoanCalcOutput.MatMonth").value + "/" + getField("LoanCalcOutput.MatDay").value + "/" + getField("LoanCalcOutput.MatYear").value;
    }
}

function Lock(f) {
    getField(f).readonly = true;
}

function CheckCoBuyer() {
    if (getField("CoBuyer.fullName").value == "") {
        event.value = ""
    }
}

function AmountFinancedCalc() {
    getField("Itemized.LoanCalcOutput.AmountFinanced").value = sum("Unpaid.Balance.Cash.Price", "TotalOther.Charges");
    event.value = diff("Itemized.LoanCalcOutput.AmountFinanced", "Prepaid.Finance.Charge");
}


function checkIf(v, c) {
    if (getField(v).value != "") {
        getField(c).checkThisBox(0, true);
    } else {
        getField(c).checkThisBox(0, false);
    }
}

function returnYear() {
    var DateArray = getField("").value.Split("/");
    event.value = DateArray[2];
}

function addNegative() {
    if (parseFloat(getField("Buyer.Net.Trade.In").value) < 0) {
        var total = parser(sum("Deal.CustomerCash", "Deal.DeferredDownPayment")) - parser(getField("Buyer.Net.Trade.In").value);
        event.value = toCurrency(total);
    } else {
        event.value = sum("Deal.CustomerCash", "Deal.DeferredDownPayment", "Buyer.Net.Trade.In");
    }
}

function formatDate() {
    var DateArray = getField("").value.Split("/");
    for (var i = 0; i < 2; i++) {
        if (DateArray[i].length == 1) {
            DateArray[i] = "0" + DateArray[i];
        }
    }
    var newDate = DateArray[0] + "/" + DateArray[1] + "/" + DateArray[2];
    event.value = newDate;
}

function addZero() {
    var stringSize = getField("x").value;
    if (stringSize.length < 2) {
        event.value = "0" + getField("x").value;
    }
}

function subtractNegative() {
    if (parseFloat(getField("Buyer.Itemization.Down.Payment").value) < 0) {
        var balance = sum("Cash.Sale.Price", "Buyer.Itemization.Down.Payment")
        event.value = toCurrency(balance);
    } else {
        event.value = diff("Cash.Sale.Price", "Buyer.Itemization.Down.Payment")
    }


}

function LockAll() {
    for (var i = 0; i < this.numFields; i++) {
        var name = this.getNthFieldName(i);

        if (aExcept.indexOf(name) == -1) {
            var f = this.getField(name);
            if (f != null) {
                f.readonly = true;
            }
        }
    }
}

function ServiceContract {
    var contractPrice = getField("Contract.ServiceContract.SellingPrice").value;

    if (contractPrice !== "" || contractPrice !== "0.00" || contractPrice !== "0" || contractPrice !== null || contractPrice !== undefined) {
        event.value = "See Term on Seperate Agreement";
    } else {
        event.value = getField("ServiceContract.Months").value
    }
}



event.value = getField("Company.salesPerson.FirstName").value + " " + getField("Company.salesPerson.LastName").value;

var difference = formatValues("Cash.Sale.Price") - parseFloat(getField("Buyer.Itemization.Down.Payment").value);

event.value = toCurrency(difference);