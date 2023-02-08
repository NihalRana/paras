/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		role: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 1,
		},
		verified: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 1,
		},
        name: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: '',
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: '',
		},
		
		password: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: '',
		},
		rememberToken: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '',
		},
	}, {
		tableName: 'users',
	});


	return User;
};
