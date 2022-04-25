module.exports = {
	env: {
		browser: true,
		es6: true,
		commonjs: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		/*
		* Common rules that you may want to change
		*/
		'indent': ['error', 'tab'],
		'quotes': ['error', 'single'],
		'max-len': ['warn', {
			'code': 120,
			'ignoreUrls': true,
			'ignoreRegExpLiterals': true,
			'ignoreTemplateLiterals': true,
		}],

		/*
		* React rules: https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
		*/
		'jsx-quotes': ['error', 'prefer-double'],

		/*
		* KG Recommended rules. Only change if you really need to
		*/
		'semi': ['error', 'always'],
		'eqeqeq': ['error', 'always'],
		'block-scoped-var': 'warn',
		'default-param-last': 'warn',
		'no-constructor-return': 'warn',
		'no-eval': 'warn',
		'no-extra-bind': 'warn',
		'no-labels': 'warn',
		'no-param-reassign': 'warn',
		'no-sequences': 'warn',
		'no-shadow': ['warn', {
			'hoist': 'functions'
		}],
		'no-implicit-globals': ['warn', {
			'lexicalBindings': true
		}],

		/*
		* KG Stylistic rules. Change if they conflict with existing codebase
		*/
		'brace-style': ['warn', '1tbs', {
			'allowSingleLine': true
		}],
		'curly': ['warn', 'multi-line'],
		'no-multi-spaces': ['warn', {
			'ignoreEOLComments': true
		}],
		'computed-property-spacing': 'warn',
		'comma-dangle': ['warn', 'only-multiline'],
		'func-call-spacing': 'warn',
		'key-spacing': 'warn',
		'keyword-spacing': 'warn',
		'lines-between-class-members': 'warn',
		'no-lonely-if': 'warn',
		'no-trailing-spaces': 'warn'
	}
};