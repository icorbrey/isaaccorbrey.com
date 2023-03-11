import { none, some, Option } from './option';

export const ok = <T, E = Error>(value: T): Result<T, E> => new Result({
	__isOk: true,
	value,
});

export const err = <T, E = Error>(error: E): Result<T, E> => new Result({
	__isOk: false,
	error,
});

export class Result<T, E> {

	private input: ResultInput<T, E>

	constructor(input: ResultInput<T, E>) {
		this.input = input;
	}

	/**
	 * Returns `true` if this `Result<T, E>` is `Ok<T>`, otherwise returns `false`.
	 */
	isOk = () => this.__isOk(this.input);

	/**
	 * Returns `true` if this `Result<T, E>` is `Err<T>`, otherwise returns `false`.
	 */
	isErr = () => !this.__isOk(this.input);

	/**
	 * Extracts the inner value if this `Result<T, E>` is `Ok<T>`. Otherwise, throws the given message.
	 * @param message The message to throw if the `Result<T, E>` is `Err<E>`.
	 */
	expect = <M = string>(message: M): T => {
		if (!this.__isOk(this.input)) {
			throw message;
		}

		return this.input.value;
	}

	/**
	 * Extracts the inner value if this `Result<T, E>` is `Ok<T>`. Otherwise, throws the inner error.
	 */
	unwrap = (): T => {
		if (!this.__isOk(this.input)) {
			throw this.input.error;
		}

		return this.input.value;
	}

	/**
	 * Extracts the inner value if this `Result<T, E>` is `Ok<T>`. Otherwise, returns the fallback value.
	 * @param fallback The value to return if this `Result<T, E>` is `Err<E>`.
	 */
	unwrapOr = (fallback: T): T => {
		if (!this.__isOk(this.input)) {
			return fallback;
		}

		return this.input.value;
	}

	/**
	 * Extracts the inner value if this `Result<T, E>` is `Ok<T>`. Otherwise, returns the result of the given fallback function.
	 * @param fallbackFn The function to return the result of if this `Result<T, E>` is `Err<E>`.
	 */
	unwrapOrElse = (fallbackFn: () => T): T => {
		if (!this.__isOk(this.input)) {
			return fallbackFn();
		}

		return this.input.value;
	}

	/**
	 * Extracts the inner error if this `Result<T, E>` is `Err<E>`. Otherwise, throws the given message.
	 * @param message The message to throw if the `Result<T, E>` is `Ok<T>`.
	 */
	expectErr = <M = Error>(message: M): E => {
		if (this.__isOk(this.input)) {
			throw message;
		}

		return this.input.error;
	}

	/**
	 * Extracts the inner value if this `Result<T, E>` is `Ok<T>`. Otherwise, throws a generic message.
	 */
	unwrapErr = (): E =>
		this.expectErr('`Result<T, E>` was `Ok<T>`, expected `Err<E>`.');

	/**
	 * Returns `Some<E>` if this `Result<T, E>` is `Err<E>`. Otherwise, returns `None`.
	 */
	err = (): Option<E> => {
		if (this.__isOk(this.input)) {
			return none();
		}

		return some(this.input.error);
	}

	/**
	 * Returns `Some<T>` if this `Result<T, E>` is `Ok<T>`. Otherwise, returns `None`.
	 */
	ok = (): Option<T> => {
		if (!this.__isOk(this.input)) {
			return none();
		}

		return some(this.input.value);
	}

	/**
	 * Transposes this `Result<Option<T>, E>` into `Option<Result<T, E>>`.
	 */
	transpose = <U extends (T extends Option<infer V> ? V : never)>(): Option<Result<U, E>> => {
		if (!this.__isOk(this.input)) {
			return some(err(this.input.error))
		}

		if (!(this.input.value instanceof Option<U>)) {
			throw 'Expected `Result<Option<any>>`, got `Result<any>`.'
		}

		if (this.input.value.isSome()) {
			return some(ok(this.input.value.unwrap()))
		}

		return none();
	}

	/**
	 * If this `Result<T, E>` is `Ok<T>`, returns the transformed value as `Ok<U>`. Otherwise, returns `Err<E>`.
	 * @param transform Transforms a value of type `T` into a value of type `U`.
	 */
	map = <U>(transform: (value: T) => U): Result<U, E> => {
		if (!this.__isOk(this.input)) {
			return err(this.input.error);
		}

		return ok(transform(this.input.value));
	}

	/**
	 * If this `Result<T, E>` is `Err<E>`, returns the transformed value as `Err<F>`. Otherwise, returns `Ok<T>`.
	 * @param transform Transforms a value of type `E` into a value of type `F`.
	 */
	mapErr = <F>(transform: (error: E) => F): Result<T, F> => {
		if (this.__isOk(this.input)) {
			return ok(this.input.value);
		}

		return err(transform(this.input.error));
	}

	private __isOk = (input: ResultInput<T, E>): input is ValueInput<T> =>
		input.__isOk;
}

type ResultInput<T, E> =
	| ValueInput<T>
	| ErrorInput<E>

type ValueInput<T> = {
	__isOk: true
	value: T
}

type ErrorInput<E> = {
	__isOk: false
	error: E
}
