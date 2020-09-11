// tslint:disable-next-line:import-blacklist
import * as _ from 'lodash';
import * as m from 'mochainon';
import * as parallel from 'mocha.parallel';
import PUBLIC_KEY from '../../data/public-key';
import { balena, givenLoggedInUser } from '../setup';
import type * as BalenaSdk from '../../..';
const { expect } = m.chai;

describe('Key Model', function () {
	describe('given no keys', function () {
		describe('balena.models.key.getAll()', function () {
			givenLoggedInUser(before);

			parallel('', function () {
				it('should become an empty array', function () {
					const promise = balena.models.key.getAll();
					return expect(promise).to.become([]);
				});

				it('should support arbitrary pinejs options', () =>
					balena.models.key
						.create('MyKey', PUBLIC_KEY)
						.then(() => balena.models.key.getAll({ $select: ['public_key'] }))
						.then(function (keys) {
							const key = keys[0];
							expect(key.public_key).to.equal(PUBLIC_KEY);
							expect(key.title).to.be.undefined;
						}));

				it('should support a callback with no options', function (done) {
					(balena
						.models.key.getAll as (...args: any[]) => any)(function (_err: Error, keys: BalenaSdk.SSHKey[]) {
						try {
							expect(keys).to.deep.equal([]);
							done();
						} catch (err) {
							done(err);
						}
					});
				});
			});
		});

		describe('balena.models.key.create()', function () {
			givenLoggedInUser(beforeEach);

			it('should be able to create a key', function () {
				const key = PUBLIC_KEY;
				return balena.models.key
					.create('MyKey', key)
					.then(() => balena.models.key.getAll())
					.then(function (keys) {
						expect(keys).to.have.length(1);
						expect(keys[0].public_key).to.equal(key.replace(/\n/g, ''));
						expect(keys[0].title).to.equal('MyKey');
					});
			});

			it('should be able to create a key from a non trimmed string', function () {
				const key = PUBLIC_KEY;
				return balena.models.key
					.create('MyOtherKey', `    ${key}    `)
					.then(() => balena.models.key.getAll())
					.then(function (keys) {
						expect(keys).to.have.length(1);
						expect(keys[0].public_key).to.equal(key.replace(/\n/g, ''));
						expect(keys[0].title).to.equal('MyOtherKey');
					});
			});
		});
	});

	describe('given a single key', function () {
		givenLoggedInUser(before);

		let ctx: Mocha.Context;
		before(function () {
			ctx = this;
			const publicKey = PUBLIC_KEY;
			return balena.models.key.create('MyKey', publicKey).then((key) => {
				return (this.key = key);
			});
		});

		describe('balena.models.key.getAll()', () => {
			it('should become the list of keys', function () {
				return balena.models.key.getAll().then((keys) => {
					expect(keys).to.have.length(1);
					expect(keys[0].public_key).to.equal(
						this.key.public_key.replace(/\n/g, ''),
					);
					expect(keys[0].title).to.equal('MyKey');
				});
			});
		});

		parallel('balena.models.key.get()', function () {
			it('should be able to get a key', function () {
				return balena.models.key.get(ctx.key.id).then((key) => {
					expect(key.public_key).to.equal(
						ctx.key.public_key.replace(/\n/g, ''),
					);
					expect(key.title).to.equal('MyKey');
				});
			});

			it('should be rejected if the key id is invalid', function () {
				const promise = balena.models.key.get(99999999999);
				return expect(promise).to.be.rejectedWith('Request error');
			});
		});

		describe('balena.models.key.remove()', () => {
			it('should be able to remove the key', function () {
				return balena.models.key.remove(this.key.id).then(function () {
					const promise = balena.models.key.getAll();
					return expect(promise).to.eventually.have.length(0);
				});
			});
		});
	});
});
