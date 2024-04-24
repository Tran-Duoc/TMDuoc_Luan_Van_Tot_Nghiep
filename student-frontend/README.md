This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

trong fast api viết api route tính xác suất của nhẵn trong file csv gửi từ client .
lưu ý chỉ cần tính toán xác suất không cần xấy dựng model dự đoán;
yêu cầu:
1, nhận vào tập dữ liệu ,dòng cuối chính là giá trị cần dự đoán xem nhãn là gì nên bạn cần phải tính % của các giá trị dự đoán so với nhãn ở đây mình sẽ ví dụ như sao
x = ít, thấp, nam //3 giá trị này là giá trị cần dự đoán xem kết quả có mưa hay không mưa,
với x cần tính xác suất mưa là bao nhiêu phần trăm và không mưa là bao nhiêu phần trăm. kết quả trả về là % 2 nhãn (nhãn là cột cuối của tập dữ liệu và là giá trị rời rạc).

2, tính toán xác suất của từng nhẵn p(x/ mưa) và p(x/ không mưa) dùng cồng thức laplace conlection (tử cộng 1 , mẫu cộng số nhãn ví dụ mưa và không mưa thì mẫu coog 2) đê phòng trường hợp xác suất bằng 0. sau đó tính xác suất p(x) là tổng xác suất của nhãn. ví dụ có 2 nhãn mưa và không mưa p(x) = p(x/mưa).p(mưa) +p(x/ không mưa).p(không mưa)
xác xuất là đếm các phẩn tử trong tập dữ liệu vẫn dùng laplace conlection

3, tính tất cả xác suất. thí dụ
p(mưa/ x) = (p(x/mưa) . p(mưa)) / p(x)
và p(không mưa/x) tương tự

yêu cầu trả về xác suất của nhãn.
ở đây tôi có file mẫu và bạn tham khảo để code cho đúng

May Ap suat Gio Ket qua
it cao Bac khong mua
nhieu cao Bac mua
it thap Bac khong mua
nhieu thap Bac mua
nhieu trung binh Bac mua
it cao Nam khong mua
nhieu thap Nam mua
nhieu thap Nam ?

ở tập data này dòng cuối cùng là giá trị dự đoán
x = nhieu, thap, Nam

tính xác suất
p(X/mua) = p(it/mua) .p(thap/mua) . p(nhieu/ mua)
= (0 + 1/ 4 + 2) _ (1+ 1/ 4 + 3) _ (1+ 1 / 4 + 2) = 1/63
p(X/khong mua) = p(it/khong mua mua) .p(thapkhong /mua) . p(nhieu/khong mua mua)
= (3 + 1/ 4 + 2) _ (2+ 1/ 4 + 3) _ (2+ 1 / 4 + 2) = 1/7

p(x) = p(x/mưa).p(mua) + p(x/khong mua).p(khong mua)
= 11/14 .(4 + 1/ 8 + 2) + 1/7.(4 + 1/ 8 + 2) = 13/28

p (mua/x) = (p(x/mua).p(mua))/p(x) = (11/14 _ 0.5)/13/28 = 0.85
p (mua/x) = (p(x/mua).p(mua))/p(x) = (1/7 _ 0.5)/13/28 = 0.15
