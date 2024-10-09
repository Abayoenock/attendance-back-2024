const generateStrongPassword = (minLength = 8) => {
  if (minLength < 8) {
    throw new Error("Password length should be at least 8 characters.")
  }

  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz"
  const digits = "0123456789"
  const specialCharacters = "!@#$%&()[]{}?"
  const allCharacters =
    upperCaseLetters + lowerCaseLetters + digits + specialCharacters

  let password = ""

  // Ensure the password has at least one character from each category
  password +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)]
  password +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)]
  password += digits[Math.floor(Math.random() * digits.length)]
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)]

  // Fill the rest of the password length with random characters from all categories
  for (let i = password.length; i < minLength; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)]
  }

  // Shuffle the password to avoid any predictable patterns
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")

  return password
}

module.exports = { generateStrongPassword }
