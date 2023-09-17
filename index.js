const randomBtn = document.getElementById('random');
const number1 = document.getElementById('num1');
const number2 = document.getElementById('num2');
const res = document.getElementById('result');
const timeInput = document.querySelector('.time');

function matchAction(e) {
  e.preventDefault();
  const num1 = document.getElementById('num1').value;
  const num2 = document.getElementById('num2').value;
  const select = document.getElementById('math').value;

  console.log(num1, num2, select);
  switch (select) {
    case 'summation':
      performanceTime(num1, num2, addLargeIntegers);
      break;
    case 'subtraction':
      performanceTime(num1, num2, subtractLargeIntegers);
      break;
    case 'division':
      performanceTime(num1, num2, divideLargeNumbers);
      break;
    case 'multiplication':
      performanceTime(num1, num2, multiplyStrings);
      break;
    default:
      return;
  }
  return;
}

function subtractLargeIntegers(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);

  // Thêm ký tự '0' vào xâu ngắn hơn để đảm bảo cùng độ dài
  while (str1.length < maxLength) {
    str1 = '0' + str1;
  }
  while (str2.length < maxLength) {
    str2 = '0' + str2;
  }

  let result = '';
  let borrow = 0;

  const isNegative = isGreaterOrEqual(str2, str1);

  if (isNegative) {
    [str1, str2] = [str2, str1];
  }

  for (let i = maxLength - 1; i >= 0; i--) {
    const digit1 = parseInt(str1[i]);
    const digit2 = parseInt(str2[i]);

    let difference = digit1 - digit2 - borrow;

    if (difference < 0) {
      difference += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = difference + result;
  }

  // Xóa ký tự '0' không cần thiết ở đầu kết quả
  result = result.replace(/^0+/, '');

  if (result === '') {
    return '0';
  }

  return isNegative ? '-' + result : result;
}

function isGreaterOrEqual(str1, str2) {
  if (str1.length > str2.length) return true;
  if (str1.length < str2.length) return false;

  for (let i = 0; i < str1.length; i++) {
    if (str1[i] > str2[i]) return true;
    if (str1[i] < str2[i]) return false;
  }

  return true;
}

// Test với các số nguyên lớn dương và số nguyên âm lớn
const num1 = '567890';
const num2 = '4544321';

const difference = subtractLargeIntegers(num1, num2);
console.log('Hiệu:', difference);

// hàm cộng
function addLargeIntegers(num1, num2) {
  // Chuyển đổi chuỗi số thành mảng các chữ số
  const arr1 = num1.split('').map(Number);
  const arr2 = num2.split('').map(Number);

  // Đảm bảo arr1 luôn dài hơn hoặc bằng arr2
  while (arr1.length < arr2.length) {
    arr1.unshift(0);
  }

  let carry = 0;
  const result = [];

  for (let i = arr1.length - 1; i >= 0; i--) {
    const sum = arr1[i] + arr2[i] + carry;
    result.unshift(sum % 10); // Lấy chữ số hàng đơn vị
    carry = Math.floor(sum / 10); // Lấy giá trị nhớ
  }

  if (carry > 0) {
    result.unshift(carry);
  }

  return result.join('');
}

function multiplyStrings(num1, num2) {
  const bigInt1 = num1.length;
  const bigInt2 = num2.length;
  // tao mang  m+n  chu so 0
  const result = Array(bigInt1 + bigInt2).fill(0);

  for (let i = bigInt1 - 1; i >= 0; i--) {
    for (let j = bigInt2 - 1; j >= 0; j--) {
      const mul_result = Number(num1[i]) * Number(num2[j]);

      const temp = result[i + j + 1] + mul_result;
      result[i + j + 1] = temp % 10;
      result[i + j] += Math.floor(temp / 10);
    }
  }
  //loai bo so 0 thua 0 dau
  while (result[0] === 0) {
    result.shift();
  }

  return result.length === 0 ? '0' : result.join('');
}

function divideLargeNumbers(dividend, divisor) {
  // Kiểm tra trường hợp đặc biệt khi số chia là 0
  if (divisor === '0') {
    throw new Error('Divisor cannot be zero.');
  }

  // Kiểm tra trường hợp đặc biệt khi số bị chia là 0
  if (dividend === '0') {
    return '0';
  }

  // Xác định dấu của kết quả
  const isNegative = (dividend[0] === '-' && divisor[0] !== '-') || (dividend[0] !== '-' && divisor[0] === '-');
  dividend = dividend.replace('-', '');
  divisor = divisor.replace('-', '');

  // Chuyển chuỗi số thành mảng chữ số
  const dividendArray = dividend.split('').map(Number);
  const divisorArray = divisor.split('').map(Number);

  // Xác định kết quả và phần dư ban đầu
  let quotient = [];
  let remainder = [];

  for (let i = 0; i < dividendArray.length; i++) {
    const digit = dividendArray[i];

    // Thêm chữ số vào phần dư
    remainder.push(digit);

    // Kiểm tra xem phần dư có lớn hơn số chia không
    if (compareNumbers(remainder, divisorArray) >= 0) {
      let count = 0;

      // Thực hiện phép nhân liên tiếp để tìm chữ số của phần nguyên
      while (compareNumbers(remainder, divisorArray) >= 0) {
        remainder = subtractNumbers(remainder, divisorArray);
        count++;
      }

      // Thêm chữ số vào phần nguyên
      quotient.push(count);
    } else {
      // Nếu phần dư nhỏ hơn số chia, thêm 0 vào phần nguyên
      quotient.push(0);
    }
  }

  // Xóa các chữ số 0 không cần thiết ở đầu phần nguyên
  while (quotient.length > 1 && quotient[0] === 0) {
    quotient.shift();
  }

  // Chuyển kết quả thành chuỗi và thêm dấu nếu cần
  let result = quotient.join('');

  if (isNegative) {
    result = '-' + result;
  }

  return result;
}

// Hàm so sánh hai mảng chữ số
function compareNumbers(arr1, arr2) {
  if (arr1.length > arr2.length) {
    return 1;
  } else if (arr1.length < arr2.length) {
    return -1;
  } else {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] > arr2[i]) {
        return 1;
      } else if (arr1[i] < arr2[i]) {
        return -1;
      }
    }
    return 0;
  }
}

// Hàm trừ hai mảng chữ số
function subtractNumbers(arr1, arr2) {
  let result = [];
  let borrow = 0;

  for (let i = arr1.length - 1; i >= 0; i--) {
    let difference = arr1[i] - borrow;

    if (i < arr2.length) {
      difference -= arr2[i];
    }

    if (difference < 0) {
      difference += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result.unshift(difference);
  }

  // Xóa các chữ số 0 không cần thiết ở đầu
  while (result.length > 1 && result[0] === 0) {
    result.shift();
  }

  return result;
}


function getRandomLargeIntegers(digits) {
  let num1 = '';
  let num2 = '';

  for (let i = 0; i < digits; i++) {
    const digit1 = Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
    const digit2 = Math.floor(Math.random() * 10);

    num1 += digit1;
    num2 += digit2;
  }

  return { num1, num2 };
}

// Sử dụng hàm và lấy kết quả

randomBtn.onclick = () => {
  console.log(getRandomLargeIntegers(40));
  const { num1, num2 } = getRandomLargeIntegers(80);
  number1.value = num1;
  number2.value = num2;
};

const clearBtn = document.getElementById('clear');
clearBtn.onclick = () => {
  number1.value = '';
  number2.value = '';
  res.value = '';
  timeInput.value = '0 milliseconds';
};

// do thoi gian xu li
function performanceTime(num1, num2, func) {
  const start = performance.now();
  func(num1, num2);
  const end = performance.now();
  const time = end - start;
  res.value = func(num1, num2);
  timeInput.value = time.toFixed(3) + ' milliseconds';
  // alert(
  //   'result: ' + func(num1, num2) + ' in: ' + time.toFixed(3) + ' milliseconds'
  // );
}
