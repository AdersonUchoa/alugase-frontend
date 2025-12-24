// ===== CPF =====
export const formatCPF = (value) => {
  if (!value) return '';

  const onlyNumbers = value.replace(/\D/g, '').slice(0, 11);

  if (onlyNumbers.length <= 3) return onlyNumbers;
  if (onlyNumbers.length <= 6) return onlyNumbers.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  if (onlyNumbers.length <= 9) return onlyNumbers.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');

  return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
};

export const removeCpfMask = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

export const validateCpf = (cpf) => {
  if (!cpf || cpf.length === 0) return false;
  
  const cleanCpf = removeCpfMask(cpf);

  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) return false;

  const calcularDigito = (base, pesoInicial) => {
    const soma = base
      .split("")
      .reduce((acc, num, i) => acc + Number(num) * (pesoInicial - i), 0);
    const resto = 11 - (soma % 11);
    return resto > 9 ? 0 : resto;
  };

  const base = cleanCpf.slice(0, 9);
  const dv1 = calcularDigito(base, 10);
  const dv2 = calcularDigito(base + dv1, 11);
  return cleanCpf === base + dv1 + dv2;
};

export const validateCpfWithMessage = (cpf) => {
  return validateCpf(cpf) ? '' : 'CPF Inválido';
};

// ===== TELEFONE =====
export const formatPhone = (value) => {
  if (!value) return '';

  const digits = removePhoneMask(value).slice(0, 11);

  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) return `(${ddd}) ${number}`;

  if (number.length === 5) return `(${ddd}) ${number[0]} ${number.slice(1)}`;

  if (number.length > 5) {
    if (number.length === 8) {
      return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
    } else {
      return `(${ddd}) ${number[0]} ${number.slice(1, 5)}-${number.slice(5)}`;
    }
  }

  return `(${ddd}) ${number}`;
};

export const removePhoneMask = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

export const validatePhone = (value) => {
  if (typeof value !== "string" || !value) return false;

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length < 10 || cleanValue.length > 11) return false;

  return true;
};

export const validatePhoneWithMessage = (value) => {
  return validatePhone(value) ? '' : 'Telefone inválido';
};