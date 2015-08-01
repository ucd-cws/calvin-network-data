module.exports.months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

module.exports.END_gen = function() {
	return "..         \n";
};

module.exports.LINK_gen = function(name, source, dest, val, cost, lower_const, upper_const) {
	return "LINK      " + name + "      " + source + " " + dest + "   " + val + "     " + cost + "     " + lower_const + "    " + upper_const + "\n";
};

module.exports.P_gen = function(name, MO, A, B, C, D, E, F) {
	return name + "       " + " MO=" + MO + " A=" + A + " B=" + B + " C=" + C + " D=" + D + " E=" + E + " F=" + F + "\n";
};

module.exports.Q_gen = function(name, A, B, C, D, E, F) {
	return name + "       " + " A=" + A + " B=" + B + " C=" + C + " D=" + D + " E=" + E + " F=" + F + "\n";
}
	// QI = Initial Flow
module.exports.QI_gen = function(A, B, C, D, E, F) {
	return "QI       " + " A=" + A + " B=" + B + " C=" + C + " D=" + D + " E=" + E + " F=" + F + "\n";
};

module.exports.BOUND_gen = function(bounds_values) {
	var output = outstr;
	if( bounded_values !== '') { //will check if contents fit regex if necessary
		output = output + "BU        " + bounded_values + "\n";
	}
	return output;
};
