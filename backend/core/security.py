import hashlib
import secrets


PASSWORD_HASH_ITERATIONS = 600_000


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PASSWORD_HASH_ITERATIONS,
    ).hex()

    return f"pbkdf2_sha256${PASSWORD_HASH_ITERATIONS}${salt}${password_hash}"
