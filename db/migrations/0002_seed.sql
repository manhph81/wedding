-- 0002_seed — chèn 1 lời chúc mẫu nếu bảng đang trống (để demo có dữ liệu).

insert into wishes (name, message)
select 'Gia đình bên nội', 'Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử!'
where not exists (select 1 from wishes);
