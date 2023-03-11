import type { Predicate } from '$lib/types/Predicate';
import { err, ok, type Result } from './result';

export const some = <T>(value: T) => new Option<T>(value);
export const none = <T>() => new Option<T>();

export class Option<T> {

	private value?: T;

	constructor(value?: T) {
		this.value = value;
	}

	/**
	 * Returns `true` if this `Option<T>` is `Some<T>`, otherwise returns `false`.
	 */
	isSome = () => this.__isSome(this.value);

	/**
	 * Returns `true` if this `Option<T>` is `None`, otherwise returns `false`.
	 */
	isNone = () => !this.__isSome(this.value);

	/**
	 * Extracts the inner value if this `Option<T>` is `Some<T>`. Otherwise, throws the given message.
	 * @param message The message to throw if the `Option<T>` is `None`.
	 */
	expect = <E = string>(message: E): T => {
		if (!this.__isSome(this.value)) {
			throw message;
		}

		return this.value;
	}

	/**
	 * Extracts the inner value if this `Option<T>` is `Some<T>`. Otherwise, throws a generic message.
	 */
	unwrap = (): T =>
		this.expect('`Option` was `None`.');

	/**
	 * Extracts the inner value if this `Option<T>` is `Some<T>`. Otherwise, returns the fallback value.
	 * @param fallback The value to return if this `Option<T>` is `None`.
	 */
	unwrapOr = (fallback: T): T => {
		if (!this.__isSome(this.value)) {
			return fallback;
		}

		return this.value;
	}

	/**
	 * Extracts the inner value if this `Option<T>` is `Some<T>`. Otherwise, returns the result of the given fallback function.
	 * @param fallbackFn The function to return the result of if this `Option<T>` is `None<T>`.
	 */
	unwrapOrElse = (fallbackFn: () => T): T => {
		if (!this.__isSome(this.value)) {
			return fallbackFn();
		}

		return this.value;
	}

	/**
	 * Transforms `Some<T>` into `Ok<T>` and `None` into `Err<E>` using the given error.
	 * @param error The error to return if this `Option<T>` is `None`.
	 */
	okOr = <E = Error>(error: E): Result<T, E> => {
		if (!this.__isSome(this.value)) {
			return err(error);
		}

		return ok(this.value);
	}

	/**
	 * Transforms `Some<T>` into `Ok<T>` and `None` into `Err<E>` using the given function.
	 * @param getError Returns the error to return if this `Option<T>` is `None`.
	 */
	okOrElse = <E = Error>(getError: () => E): Result<T, E> => {
		if (!this.__isSome(this.value)) {
			return err(getError());
		}

		return ok(this.value);
	}

	/**
	 * Returns `Some<T>` if this `Option<T>` is `Some<T>` and matches the given predicate. Otherwise, returns `None`.
	 * @param predicate The function to filter the inner value by if this `Option<T>` is `Some<T>`.
	 */
	filter = (predicate: Predicate<T>): Option<T> => {
		if (!this.__isSome(this.value) || !predicate(this.value)) {
			return none();
		}

		return this;
	}

	/**
	 * Removes one level of nesting from an `Option<Option<T>>`.
	 */
	flatten = <U extends (T extends Option<infer V> ? V : T)>(): Option<U> => {
		if (this.value instanceof Option<U>) {
			if (this.value.isSome()) {
				return some(this.value.unwrap());
			}

			return none();
		}

		return this as unknown as Option<U>;
	}

	/**
	 * If this `Option<T>` is `Some<T>`, returns the transformed value as `Some<U>`. Otherwise, returns `None`.
	 * @param transform Transforms a value of type `T` into a value of type `U`.
	 */
	map = <U>(transform: (value: T) => U): Option<U> => {
		if (!this.__isSome(this.value)) {
			return none();
		}

		return some(transform(this.value));
	}

	/**
	 * If this `Option<T>` is `Some<T>`, returns the transformed value as `Some<U>`. Otherwise, returns the fallback value as `Some<U>`.
	 * @param transform Transforms a value of type `T` into a value of type `U`.
	 * @param fallback The value to return if this `Option<T>` is `None`.
	 */
	mapOr = <U>(transform: (value: T) => U, fallback: U): Option<U> => {
		if (!this.__isSome(this.value)) {
			return some(fallback);
		}

		return some(transform(this.value));
	}

	/**
	 * If this `Option<T>` is `Some<T>`, returns the transformed value as `Some<U>`. Otherwise, returns the fallback value as `Some<U>`.
	 * @param transform Transforms a value of type `T` into a value of type `U`.
	 * @param fallbackFn The function to return the result of if this `Option<T>` is `None`.
	 */
	mapOrElse = <U>(transform: (value: T) => U, fallbackFn: () => U): Option<U> => {
		if (!this.__isSome(this.value)) {
			return some(fallbackFn());
		}

		return some(transform(this.value));
	}

	/**
	 * Returns `Some<[T, U]>` if this `Option<T>` is `Some<T>` and the given `Option<U>` is `Some<U>`. Otherwise, returns `None`.
	 * @param other The other `Option` to zip with.
	 */
	zip = <U>(other: Option<U>): Option<[T, U]> => {
		if (!this.__isSome(this.value)) {
			return none();
		}

		return other.map(otherValue => [this.value as T, otherValue]);
	}

	/**
	 * Transforms the result of zipping this `Option<T>` with the given `Option<U>`.
	 * @param other The other `Option` to zip with.
	 * @param transform Transforms a value of type `[T, U]` into a value of type `V`.
	 * @returns 
	 */
	zipWith = <U, V>(other: Option<U>, transform: (value: [T, U]) => V): Option<V> =>
		this.zip(other).map(transform);

	private __isSome = (value?: T): value is T =>
		value !== null && value !== undefined
}
