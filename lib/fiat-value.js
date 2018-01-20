module.exports = function calculateFiatValue(percentage, price, moreLessEqual) {
	if(moreLessEqual==='more'){
		percentage = 100+percentage;
	} else if(moreLessEqual === 'less') {
		percentage = 100-percentage;
	}
	return price * percentage / 100;
}