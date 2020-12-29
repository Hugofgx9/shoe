const matrixProduct = (A, B) => {
	let result = [];

	if ( A[0].length != B.length ) {
		console.error('Matrix can\'t be multiply because of dimensions');
	} else {
		//number of lines of A
		let m = A.length;
		//number of columns of A;
		//let n = A[0].length;
		//number of lines of B;
		let n = B.length;
		//number of columns of B;
		let p = B[0].length;

		for ( let i = 0 ; i < m ; i++ ) {
			result[i] = [];

			for ( let j = 0 ; j < p ; j++ ) {
				result[i][j] = 0;

				for ( let k = 0 ; k < n ; k++ ) {
					result[i][j] += A[i][k] * B[k][j];

				}
			}
		}
		return result;
	}
};

const matrixAddition = (A, B) => {
	let result = [];

	if ( A.length != B.length || A[0].length != B[0].length  ) {
		console.error('Matrix can\'t be add because of dimensions');
	} else {
		//number of lines of A & B
		let m = A.length;
		//number of columns of A & B;
		let n = A[0].length;


		for ( let i = 0 ; i < m ; i++ ) {
			result[i] = [];

			for ( let j = 0 ; j < n ; j++ ) {
				result[i][j] = A[i][j] + B[i][j];
			}
		}
		//console.log(A, B, result);
		return result;
	}
};

//objAngles = {x, y, z};
//rotationMovement = {x, y, z};
//3d rotation between 2 different referentiels
const rotation3d = (rotationMovement, objAngles) => {

	const cos = (x) => Math.cos(x);
	const sin = (x) => Math.sin(x);
	//create rotation matrix
	const rotMatrix = (alpha, beta, gamma) => {
		let result = {
			x: [[1, 0, 0], [0, cos(alpha), -sin(alpha)], [0, sin(alpha), cos(alpha) ]],
			y: [[cos(beta), 0, sin(beta)], [0, 1, 0], [-sin(beta), 0, cos(beta)]],
			z: [[cos(gamma), -sin(gamma), 0], [sin(gamma), cos(gamma), 0], [0, 0, 1]],
		};
		return result;
	};

	let newAnglesMat = [[0], [0], [0]];
	let R = rotMatrix(objAngles.x, objAngles.y, objAngles.z);

	for (const axe in R) {
		newAnglesMat = matrixAddition(newAnglesMat, matrixProduct( R[axe], [[rotationMovement.x], [rotationMovement.y], [rotationMovement.z]] ));
	}

	let newAngles = {x: newAnglesMat[0][0], y: newAnglesMat[1][0], z: newAnglesMat[2][0]};
	console.log(newAngles);

	return newAngles;
};

export { matrixProduct, matrixAddition, rotation3d };