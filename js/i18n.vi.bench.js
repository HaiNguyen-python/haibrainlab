// HaiBrainLab: Vietnamese strings for the research bench (js/bench.js)
window.I18N=window.I18N||{}; window.I18N.vi=window.I18N.vi||{};
window.I18N.vi.bench={
title:`Bàn nghiên cứu`,
intro:`Chín công cụ để làm nghiên cứu chứ không chỉ đọc về nghiên cứu. Mỗi mô hình tái lập một kết quả đã công bố, đối chiếu mô phỏng với lý thuyết ở những chỗ có lời giải chính xác, và cho xuất dữ liệu.`,
seed:`Hạt giống ngẫu nhiên`,
checks:`✓ Chạy toàn bộ phép kiểm`,
checksT:`Đối chiếu từng mô hình với giá trị lý thuyết hoặc giá trị đã công bố`,
note:`📝 Ghi chú thiết lập này`,
noteT:`Mở sổ ghi chép; ghi chú được gắn kèm công cụ và tham số hiện tại`,
running:`Đang chạy kiểm tra…`,
chkT:`Kiểm định bàn nghiên cứu`,
passed:`đạt`,
chkN:`Phép kiểm`,
chkG:`Kết quả`,
chkE:`Kỳ vọng`,
chkR:`Tham chiếu`,
done:`xong`,
// ---- Hopfield
hf_name:`Trí nhớ liên tưởng`,
hf_q:`Một mạng nơ-ron lưu ký ức và nhớ lại từ một mảnh nhỏ như thế nào?`,
hf_gridT:`Trạng thái mạng, 256 nơ-ron (bấm để vẽ)`,
hf_thT:`Mẫu đã lưu và độ trùng m (bấm để nạp)`,
hf_eT:`Năng lượng khi nhớ lại (chỉ có thể giảm)`,
hf_eX:`khung hình`,
hf_capL:`độ trùng sau khi nhớ lại`,
hf_capT:`Sức chứa: chất lượng nhớ lại theo tải (N = 400, mẫu ngẫu nhiên)`,
hf_capX:`tải α = số mẫu / số nơ-ron`,
hf_noise:`Số ô bị đảo (%)`,
hf_corrupt:`Làm nhiễu`,
hf_half:`Xoá nửa dưới`,
hf_recall:`▶ Nhớ lại`,
hf_store:`Lưu trạng thái này`,
hf_rand:`Thêm mẫu ngẫu nhiên`,
hf_blank:`Để trống`,
hf_letters:`Nạp các chữ cái giống nhau`,
hf_lettersT:`Thay bộ nhớ bằng các chữ H, A, I, N, vốn trùng nhau rất nhiều`,
hf_clear:`Đặt lại bộ nhớ`,
hf_pP:`số mẫu đã lưu`,
hf_pA:`tải α`,
hf_pM:`độ trùng cao nhất`,
hf_pE:`năng lượng`,
hf_pS:`trạng thái`,
hf_capH:`Thí nghiệm sức chứa`,
hf_capB:`Chạy thí nghiệm sức chứa`,
hf_sReady:`sẵn sàng`,
hf_sEdit:`đã sửa`,
hf_sLoaded:`đã nạp mẫu`,
hf_sCor:`đã làm nhiễu`,
hf_sHalf:`đã xoá nửa dưới`,
hf_sRun:`đang nhớ lại…`,
hf_sStored:`đã lưu`,
hf_sBlank:`trống`,
hf_sLet:`đã nạp các chữ cái giống nhau`,
hf_sConv:`đã hội tụ (điểm cố định)`,
// ---- STDP
sd_name:`Cạnh tranh giữa các khớp thần kinh (STDP)`,
sd_q:`Nếu thời điểm phát xung làm khớp thần kinh mạnh lên, điều gì ngăn tất cả cùng lớn mãi?`,
sd_hT:`Độ mạnh g / g_max của 1000 khớp thần kinh kích thích`,
sd_rL:`tần số đầu ra (Hz)`,
sd_rT:`Tần số phát xung của nơ-ron sau khớp`,
sd_x:`thời gian mô phỏng (s)`,
sd_mL:`g / g_max trung bình`,
sd_mT:`Độ mạnh khớp thần kinh trung bình`,
sd_rate:`Tần số đầu vào mỗi khớp (Hz)`,
sd_ratio:`Suy giảm / tăng cường A₋/A₊`,
sd_spd:`Tốc độ (giây mô phỏng mỗi khung hình)`,
sd_go:`▶ Chạy / tạm dừng`,
sd_re:`Đặt lại trọng số`,
sd_pT:`đã mô phỏng`,
sd_pR:`tần số đầu ra`,
sd_pLo:`yếu (< 0,2)`,
sd_pHi:`mạnh (> 0,8)`,
// ---- TD
td_name:`Dopamine và sai số dự đoán`,
td_q:`Nơ-ron dopamine tính toán điều gì khi ta học từ phần thưởng?`,
td_hT:`Sai số dự đoán δ ở từng lượt (cam = tốt hơn dự đoán, xanh = tệ hơn)`,
td_x:`thời gian trong lượt (s)`,
td_y:`lượt`,
td_cue:`tín hiệu`,
td_rew:`thưởng`,
td_l1:`lượt đầu tiên`,
td_l2:`sau khi học, có thưởng`,
td_l3:`sau khi học, bỏ thưởng`,
td_lT:`Tín hiệu kiểu dopamine δ(t): ba bản ghi kinh điển`,
td_vL:`giá trị đã học V(t)`,
td_vT:`Phần thưởng kỳ vọng còn lại ở từng thời điểm`,
td_a:`Tốc độ học α`,
td_g:`Hệ số chiết khấu γ mỗi 100 ms`,
td_lam:`Vết đủ điều kiện λ`,
td_p:`Xác suất có thưởng`,
td_n:`Số lượt`,
td_pC:`δ lúc có tín hiệu (đã học)`,
td_pR:`δ lúc thưởng đã dự đoán`,
td_pO:`δ lúc thưởng bị bỏ`,
// ---- DDM
dd_name:`Ra quyết định: nhanh hay chính xác`,
dd_q:`Não quyết định thế nào từ bằng chứng nhiễu, và vì sao chậm hơn lại chính xác hơn?`,
dd_up:`ngưỡng trả lời đúng`,
dd_lo:`ngưỡng trả lời sai`,
dd_px:`thời gian quyết định (s)`,
dd_pT:`Bằng chứng tích luỹ ở 16 lượt mẫu (nét đứt = độ trôi trung bình)`,
dd_hT:`Phân bố thời gian phản ứng: đúng (trên) và sai (dưới), 2000 lượt`,
dd_hx:`thời gian phản ứng (s)`,
dd_th:`trung bình lý thuyết`,
dd_sL:`lý thuyết, ngưỡng 0,03 → 0,25`,
dd_sT:`Đánh đổi tốc độ và độ chính xác`,
dd_sx:`thời gian phản ứng trung bình (s)`,
dd_now:`mô phỏng này`,
dd_rL:`số câu đúng mỗi giây`,
dd_rT:`Tỉ lệ thưởng theo mức thận trọng`,
dd_rx:`khoảng cách ngưỡng a`,
dd_opt:`tối ưu`,
dd_v:`Độ trôi v (chất lượng bằng chứng)`,
dd_a:`Khoảng cách ngưỡng a (mức thận trọng)`,
dd_t:`Thời gian ngoài quyết định (s)`,
dd_sv:`Biến thiên độ trôi giữa các lượt`,
dd_i:`Khoảng nghỉ giữa các lượt (s)`,
dd_pA:`độ chính xác mô phỏng / lý thuyết`,
dd_pR:`RT trung bình mô phỏng / lý thuyết`,
dd_pC:`RT trung bình đúng / sai`,
// ---- Wilson–Cowan
wc_name:`Nhịp não từ đâu ra`,
wc_q:`Kích thích và ức chế biến đầu vào đều đặn thành nhịp não như thế nào?`,
wc_osc:`dao động (chu trình giới hạn)`,
wc_fix:`trạng thái ổn định (điểm cố định)`,
wc_pT:`Mặt phẳng pha (bấm để bắt đầu lại)`,
wc_nE:`đường đẳng khuynh E (dE/dt = 0)`,
wc_nI:`đường đẳng khuynh I (dI/dt = 0)`,
wc_tr:`quỹ đạo`,
wc_E:`kích thích E`,
wc_I:`ức chế I`,
wc_tT:`Hoạt động quần thể theo thời gian`,
wc_tx:`thời gian (ms)`,
wc_bMax:`cực đại của E`,
wc_bMin:`cực tiểu của E`,
wc_bT:`Giản đồ rẽ nhánh: nhịp bật và tắt ở đâu khi đầu vào P tăng`,
wc_bx:`đầu vào ngoài P`,
wc_P:`Đầu vào ngoài P tới E`,
wc_EE:`Độ mạnh E → E`,
wc_EI:`Độ mạnh I → E`,
wc_IE:`Độ mạnh E → I`,
wc_II:`Độ mạnh I → I`,
wc_tau:`Hằng số thời gian τ (ms)`,
wc_def:`Giá trị chu trình giới hạn năm 1972`,
wc_pS:`chế độ`,
wc_pF:`tần số`,
wc_pA:`biên độ của E`,
// ---- Kuramoto
ku_name:`Cùng vào nhịp`,
ku_q:`Khi nào các bộ dao động có nhịp riêng khác nhau sẽ đồng bộ?`,
ku_cT:`Pha của 400 bộ dao động; mũi tên = r`,
ku_rL:`độ đồng bộ r(t)`,
ku_rT:`Tham số trật tự theo thời gian`,
ku_rx:`khung hình`,
ku_th:`lý thuyết`,
ku_sTh:`lý thuyết r = √(1 − K_c/K)`,
ku_sT:`Độ đồng bộ theo độ ghép: mô phỏng (chấm) và lý thuyết chính xác`,
ku_sx:`độ ghép K (theo đơn vị độ rộng tần số γ)`,
ku_K:`Độ ghép K`,
ku_spd:`Tốc độ`,
ku_re:`Xáo trộn pha`,
ku_sw:`Quét K`,
ku_pR:`r hiện tại`,
ku_pT:`lý thuyết`,
// ---- HH bistability
hh_name:`Một nơ-ron, hai trạng thái`,
hh_q:`Một nơ-ron có thể im lặng hoặc phát xung với cùng một đầu vào không?`,
hh_up:`dòng tăng dần`,
hh_dn:`dòng giảm dần`,
hh_bT:`Điện thế cực đại và cực tiểu theo dòng`,
hh_fT:`Tần số phát xung theo dòng`,
hh_kV:`điện thế màng`,
hh_kT:`Dòng nền không đổi suốt: xung 1 (xanh lục) khởi động phát xung, xung 2 (đỏ) có thể dập tắt`,
hh_kx:`thời gian (ms)`,
hh_s0:`vẫn im lặng`,
hh_s2:`đã phát xung, rồi bị dập tắt`,
hh_s1:`đã phát xung và tiếp tục`,
hh_sig:`Nhiễu dòng σ`,
hh_run:`▶ Quét dòng lên rồi xuống`,
hh_pOn:`bắt đầu phát xung tại`,
hh_pOff:`ngừng phát xung tại`,
hh_pW:`độ rộng vùng hai trạng thái`,
hh_kH:`Bật lên, tắt đi`,
hh_B:`Dòng nền (µA/cm²)`,
hh_A1:`Độ lớn xung 1`,
hh_A2:`Độ lớn xung 2`,
hh_phi:`Xung 2: trễ sau một xung thần kinh (ms)`,
hh_p1:`Mẫu sẵn: chỉ bật`,
hh_p2:`Mẫu sẵn: bật rồi tắt`,
hh_pK:`kết quả`,
// ---- spike analyser
sa_name:`Phân tích chuỗi xung`,
sa_q:`Dữ liệu xung của tôi nói gì? Dùng được với bản ghi của chính bạn.`,
sa_none:`chưa nạp xung nào`,
sa_m:`Chỉ số`,
sa_v:`Giá trị`,
sa_r:`Cách đọc`,
sa_m1:`Số xung / nơ-ron / thời lượng`,
sa_m2:`Tần số phát xung trung bình`,
sa_r2:`số xung mỗi nơ-ron mỗi giây`,
sa_r3:`1 = giống Poisson, dưới 1 = đều đặn, trên 1 = phát theo chùm hoặc tần số thay đổi`,
sa_r4:`độ bất thường cục bộ, không bị ảnh hưởng bởi thay đổi tần số chậm (Holt và cs. 1996); bằng 1 với Poisson`,
sa_m5:`Hệ số Fano`,
sa_r5:`phương sai / trung bình của số xung đếm được; bằng 1 với Poisson`,
sa_m6:`Tương quan cặp trung bình`,
sa_r6:`0 = các nơ-ron độc lập; đầu vào chung hoặc nhịp chung làm nó tăng`,
sa_tx:`thời gian (s)`,
sa_rT:`Biểu đồ raster (các nơ-ron đầu, những giây đầu)`,
sa_pT:`Tần số quần thể (Hz mỗi nơ-ron)`,
sa_iT:`Biểu đồ tần suất khoảng giữa các xung`,
sa_aT:`Tự tương quan của quần thể`,
sa_ax:`độ trễ (ms)`,
sa_ok:`đã phân tích`,
sa_demo:`Dữ liệu mẫu (50 nơ-ron, 20 s, 10 Hz)`,
sa_k1:`Poisson (ngẫu nhiên)`,
sa_k2:`Đều đặn (gamma, bậc 8)`,
sa_k3:`Phát theo chùm`,
sa_k4:`Có nhịp, 10 Hz`,
sa_gen:`Tạo dữ liệu`,
sa_net:`Dùng raster của thẻ Mạng lưới`,
sa_netT:`Lấy giây cuối cùng của các xung ở thẻ 3`,
sa_file:`Mở tệp CSV…`,
sa_unitT:`Đơn vị thời gian của cột đầu tiên`,
sa_win:`Cửa sổ đếm (ms)`,
sa_bin:`Độ rộng ô tần số (ms)`,
sa_view:`Số giây hiển thị`,
sa_paste:`Hoặc dán dữ liệu: mỗi dòng một xung, "thời gian, nơ-ron"`,
sa_parse:`Phân tích dữ liệu đã dán`,
sa_srcD:`dữ liệu mẫu`,
sa_nonet:`hãy chạy thẻ Mạng lưới trước`,
sa_srcN:`thẻ Mạng lưới, giây cuối cùng`,
sa_bad:`không tìm thấy dòng số nào`,
sa_srcP:`dữ liệu đã dán`,
// ---- planner
pw_name:`Lập kế hoạch nghiên cứu`,
pw_q:`Nghiên cứu của tôi cần bao nhiêu người tham gia?`,
pw_per:`mỗi nhóm`,
pw_cl:`lớp`,
pw_l1:`phân ngẫu nhiên từng học sinh`,
pw_l2:`phân ngẫu nhiên cả lớp`,
pw_cT:`Lực thống kê theo cỡ mẫu`,
pw_xP:`số người tham gia`,
pw_x:`số người tham gia mỗi nhóm`,
pw_tg:`lực mục tiêu`,
pw_des:`Thiết kế`,
pw_d1:`Hai nhóm độc lập`,
pw_d2:`Cùng một nhóm đo hai lần (ghép cặp)`,
pw_d:`Cỡ hiệu ứng kỳ vọng d`,
pw_po:`Lực thống kê`,
pw_m:`Số học sinh mỗi lớp (1 = không theo cụm)`,
pw_icc:`Độ giống nhau trong một lớp (ICC)`,
pw_have:`Số người tôi có thể tuyển (mỗi nhóm)`,
pw_p1:`cần`,
pw_p2:`hệ số thiết kế`,
pw_p3:`cần khi phân theo lớp`,
pw_p4:`hiệu ứng nhỏ nhất phát hiện được`,
// ---------------------------------------------------------------- lessons
lesson_hopfield:`<h2>Trí nhớ liên tưởng</h2><p><b>Mô hình.</b> Hopfield (1982): N nơ-ron, mỗi nơ-ron hoặc đang phát xung (+1) hoặc im lặng (−1). Mỗi cặp nối với nhau bằng một trọng số đối xứng đặt theo quy tắc Hebb, w<sub>ij</sub> = (1/N) Σ ξ<sub>i</sub>ξ<sub>j</sub> trên các mẫu đã lưu ξ. Mỗi nơ-ron lặp đi lặp lại việc lấy dấu của tổng đầu vào. Mỗi lần cập nhật như vậy làm giảm một hàm năng lượng, nên trạng thái lăn xuống dốc vào mẫu đã lưu gần nhất, gọi là một <b>điểm hút</b>.</p>
<div class="try"><b>Thử 1: hoàn thiện mẫu.</b> Bấm một hình đã lưu, bấm <i>Làm nhiễu</i>, rồi <i>Nhớ lại</i>. Mạng tự sửa chỗ hỏng. <i>Xoá nửa dưới</i> cũng được: nửa ký ức là đủ để tìm ra phần còn lại.</div>
<div class="try"><b>Thử 2: ký ức của riêng bạn.</b> Bấm <i>Để trống</i>, vẽ bằng cách bấm vào các ô, rồi <i>Lưu trạng thái này</i>.</div>
<div class="try"><b>Thử 3: quá tải.</b> Bấm <i>Thêm mẫu ngẫu nhiên</i> nhiều lần rồi thử nhớ lại các hình. Qua một mức nào đó chúng không còn ổn định, và việc nhớ lại kết thúc ở những hỗn hợp chưa từng được lưu (trạng thái giả).</div>
<div class="try"><b>Thử 4: ký ức giống nhau gây nhiễu lẫn nhau.</b> Bấm <i>Nạp các chữ cái giống nhau</i>. Chỉ có bốn mẫu, thấp hơn sức chứa rất nhiều, vậy mà nhớ lại vẫn hỏng: H và N trùng nhau 87 % số ô và nhập thành một trạng thái pha trộn. Chỉ có I, chữ khác biệt nhất, còn nguyên vẹn.</div>
<h3>Đối chiếu lý thuyết</h3><p>Với các mẫu ngẫu nhiên, việc nhớ lại sụp đổ ở tải α<sub>c</sub> ≈ 0,138 mẫu mỗi nơ-ron (Amit, Gutfreund & Sompolinsky 1985). Thí nghiệm sức chứa đo điều này với 400 nơ-ron. Mức sụt chỉ dốc đứng khi mạng rất lớn. Giới hạn 0,138 giả định các mẫu không liên quan đến nhau; các mẫu giống nhau gây nhiễu sớm hơn nhiều, như ở Thử 4.</p>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Cách hiểu chuẩn về vùng CA3 của hồi hải mã như một bộ nhớ tự liên tưởng dựa trên ý tưởng này (Marr 1971; Treves & Rolls 1994). Hopfield được trao chung giải Nobel Vật lý 2024 nhờ nó. Vì các ký ức giống nhau gây nhiễu lẫn nhau, các lý thuyết về hồi hải mã giao cho hồi răng nhiệm vụ làm cho các đầu vào bớt giống nhau trước khi lưu (tách mẫu; Leutgeb và cs. 2007; Yassa & Stark 2011). Mạng Hopfield hiện đại lưu được nhiều mẫu hơn hẳn và có liên hệ toán học với cơ chế chú ý trong transformer (Krotov & Hopfield 2016; Ramsauer và cs. 2021).</p>
<h3>Giới hạn</h3><p>Khớp thần kinh thật không đối xứng, một nơ-ron thật hoặc là kích thích hoặc là ức chế, và hoạt động vỏ não thì thưa. Mô hình cho thấy một nguyên lý, không phải sơ đồ mạch.</p>
<p class="refs">Hopfield 1982, PNAS · Amit, Gutfreund & Sompolinsky 1985, Phys Rev Lett · Marr 1971, Phil Trans R Soc B · Treves & Rolls 1994, Hippocampus · Leutgeb et al. 2007, Science · Yassa & Stark 2011, Trends Neurosci · Krotov & Hopfield 2016, NeurIPS · Ramsauer et al. 2021, ICLR</p>`,
lesson_stdp:`<h2>Cạnh tranh giữa các khớp thần kinh</h2><p><b>Mô hình.</b> Song, Miller & Abbott (2000): một nơ-ron tích hợp và phát xung nhận 1000 khớp thần kinh kích thích phát xung ngẫu nhiên, cộng thêm 200 khớp ức chế. Mỗi khớp kích thích tuân theo quy tắc thời điểm xung ở thẻ Khớp thần kinh: đầu vào đến ngay trước một xung đầu ra thì được tăng cường, đến ngay sau thì bị làm yếu. Suy giảm được đặt hơi mạnh hơn tăng cường (A₋/A₊ = 1,05).</p>
<p><b>Điều gì xảy ra.</b> Lúc đầu nơ-ron phát xung nhanh đến mức xung vào và xung ra ghép cặp gần như ngẫu nhiên, nên phần suy giảm hơi mạnh hơn thắng thế và tổng kích thích giảm. Khi việc phát xung phụ thuộc vào dao động ngẫu nhiên, những đầu vào tình cờ gây ra xung sẽ mạnh lên, còn các đầu vào khác yếu đi. Các khớp tách thành một nhóm mạnh và một nhóm im lặng.</p>
<div class="try"><b>Thử 1.</b> Bấm <i>Chạy</i>. Nơ-ron bắt đầu ở gần 180 Hz, trọng số giảm trong khoảng một phút mô phỏng, rồi trong một đến hai nghìn giây mô phỏng tiếp theo biểu đồ tách thành hai đỉnh.</div>
<div class="try"><b>Thử 2: chuẩn hoá tần số.</b> Đặt lại và chạy ở 10 Hz, rồi đặt lại và chạy ở 40 Hz. Đầu vào lớn gấp bốn, nhưng tần số đầu ra chỉ tăng từ khoảng 13 lên khoảng 20 Hz, vì ít khớp còn mạnh hơn (khoảng một nửa ở 10 Hz, khoảng một phần mười ở 40 Hz).</div>
<div class="try"><b>Thử 3.</b> Đặt lại với A₋/A₊ = 1,00: không gì kìm hãm sự lớn lên, mọi khớp bão hoà và nơ-ron phát xung hàng trăm Hz. Với 1,12, suy giảm thắng và nơ-ron im bặt. Sự ổn định nằm trong một dải hẹp ở giữa.</div>
<div class="try"><b>Thử 4: một cái bẫy.</b> Để nó ổn định ở 40 Hz, rồi hạ đầu vào xuống 10 Hz. Nơ-ron im lặng và cứ im mãi: không có xung đầu ra thì quy tắc này không thể tăng cường bất cứ thứ gì.</div>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Nó cho thấy một quy tắc thời điểm hoàn toàn cục bộ có thể ổn định tần số phát xung của nơ-ron và khiến các đầu vào cạnh tranh nhau, mà không cần bước chuẩn hoá tường minh nào.</p>
<h3>Giới hạn</h3><p>Độ mạnh khớp thần kinh đo được trong thực nghiệm không có hai đỉnh. Chúng tạo thành một phân bố lệch, gần với log-chuẩn (Song và cs. 2005; Buzsáki & Mizuseki 2014). Những quy tắc trong đó khớp mạnh được tăng cường ít hơn cho ra một đỉnh duy nhất (van Rossum, Bi & Turrigiano 2000). Tham số nằm trong tài liệu phương pháp.</p>
<p class="refs">Song, Miller & Abbott 2000, Nat Neurosci · van Rossum, Bi & Turrigiano 2000, J Neurosci · Song et al. 2005, PLoS Biol · Buzsáki & Mizuseki 2014, Nat Rev Neurosci</p>`,
lesson_td:`<h2>Dopamine và sai số dự đoán</h2><p><b>Mô hình.</b> Học theo sai khác thời gian (Sutton 1988), được Montague, Dayan & Sejnowski (1996) và Schultz, Dayan & Montague (1997) đề xuất là thứ mà nơ-ron dopamine báo cáo. Ở mỗi thời điểm, bộ học giữ một ước lượng V về phần thưởng còn sắp đến. Sai số là δ = thưởng + γ·V(kế tiếp) − V(hiện tại). Mỗi bước 100 ms sau tín hiệu có một trọng số riêng, và δ điều chỉnh các trọng số ấy.</p>
<p><b>Ba bản ghi kinh điển, được tái lập.</b> Trước khi học, δ bùng lên lúc có thưởng. Sau khi học, nó bùng lên lúc có tín hiệu và im lặng lúc phần thưởng đã được dự đoán. Nếu bỏ phần thưởng, δ tụt xuống dưới mức nền đúng vào thời điểm lẽ ra có thưởng.</p>
<div class="try"><b>Thử 1: sai số di chuyển thế nào.</b> Với λ = 0, bản đồ nhiệt cho thấy δ bò ngược từ phần thưởng về tín hiệu, mỗi lượt một bước. Các bản ghi thật không cho thấy cái bướu di chuyển chậm này. Đặt λ = 0,9: đáp ứng với tín hiệu xuất hiện trong khoảng mười lượt thay vì khoảng một trăm, gần với dữ liệu hơn (Pan và cs. 2005).</div>
<div class="try"><b>Thử 2: phần thưởng không chắc chắn.</b> Đặt xác suất bằng 0,5. Đáp ứng với tín hiệu chỉ còn khoảng một nửa, còn đáp ứng với phần thưởng không bao giờ biến mất (Fiorillo, Tobler & Schultz 2003).</div>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Việc học được thúc đẩy bởi sự bất ngờ, không phải bởi bản thân phần thưởng. Một phần thưởng được dự đoán hoàn toàn không dạy được gì, điều này giải thích hiện tượng chặn (Kamin 1969; Rescorla & Wagner 1972). Chính tín hiệu sai số này vận hành các hệ học tăng cường hiện đại.</p>
<h3>Giới hạn</h3><p>Các nơ-ron dopamine không đồng nhất. Một số đáp ứng với vận động, cái mới hoặc sự kiện khó chịu, và các nơ-ron khác nhau dường như mã hoá những dự đoán lạc quan và bi quan (Dabney và cs. 2020). Thời gian ở đây được cắt thành các bước cố định, đó là một sự tiện lợi của mô hình.</p>
<p class="refs">Sutton 1988, Machine Learning · Montague, Dayan & Sejnowski 1996, J Neurosci · Schultz, Dayan & Montague 1997, Science · Fiorillo, Tobler & Schultz 2003, Science · Pan et al. 2005, J Neurosci · Dabney et al. 2020, Nature</p>`,
lesson_ddm:`<h2>Ra quyết định: nhanh hay chính xác</h2><p><b>Mô hình.</b> Mô hình khuếch tán có độ trôi (Ratcliff 1978). Bằng chứng nhiễu tích luỹ từ điểm xuất phát nằm giữa hai ngưỡng cho đến khi chạm một ngưỡng. Độ trôi v là chất lượng bằng chứng, khoảng cách ngưỡng a là mức thận trọng, và thời gian ngoài quyết định gồm việc nhìn thấy kích thích và bấm phím. Nhiễu được cố định ở s = 0,1 theo quy ước.</p>
<h3>Đối chiếu lý thuyết</h3><p>Với mô hình thuần này, lời giải là chính xác: độ chính xác = 1 / (1 + e<sup>−av/s²</sup>) và thời gian quyết định trung bình = (a/2v)·tanh(av/2s²) (Bogacz và cs. 2006). Các ô số so sánh 2000 lượt mô phỏng với các công thức đó.</p>
<div class="try"><b>Thử 1.</b> Nâng ngưỡng: chậm hơn và chính xác hơn. Hạ ngưỡng: đoán nhanh. Biểu đồ dưới bên trái vẽ toàn bộ đường đánh đổi.</div>
<div class="try"><b>Thử 2: lỗi chậm.</b> Khi biến thiên độ trôi bằng 0, câu sai nhanh đúng bằng câu đúng. Nâng lên 0,15: câu sai trở nên chậm hơn. Đây là lý do mô hình đầy đủ cần biến thiên giữa các lượt (Ratcliff & Rouder 1998).</div>
<div class="try"><b>Thử 3: mức thận trọng tốt nhất.</b> Biểu đồ dưới bên phải cho thấy số câu đúng mỗi giây. Nó có một cực đại; kéo dài khoảng nghỉ giữa các lượt thì điểm tối ưu dịch về phía thận trọng hơn.</div>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Khớp mô hình này với thời gian phản ứng giúp tách năng lực (độ trôi) khỏi sự thận trọng (ngưỡng), điều mà độ chính xác thô không làm được. Nó được dùng trong đo lường tâm lý và trong nghiên cứu về lão hoá, chú ý và học tập (van der Maas và cs. 2011). Nơ-ron ở vỏ não đỉnh của khỉ tăng dần hoạt động giống như bộ tích luỹ (Roitman & Shadlen 2002; Gold & Shadlen 2007).</p>
<h3>Giới hạn</h3><p>Việc từng nơ-ron vỏ đỉnh tăng dần hay nhảy bậc, và việc vùng đó có vai trò nhân quả với lựa chọn hay không, đều còn tranh cãi (Latimer và cs. 2015; Katz và cs. 2016). Mô phỏng thời gian rời rạc dùng một hiệu chỉnh ngưỡng chuẩn, mô tả trong tài liệu phương pháp.</p>
<p class="refs">Ratcliff 1978, Psychol Rev · Ratcliff & Rouder 1998, Psychol Sci · Roitman & Shadlen 2002, J Neurosci · Bogacz et al. 2006, Psychol Rev · Gold & Shadlen 2007, Annu Rev Neurosci · van der Maas et al. 2011, Psychol Rev</p>`,
lesson_wc:`<h2>Nhịp não từ đâu ra</h2><p><b>Mô hình.</b> Wilson & Cowan (1972) mô tả một mảnh vỏ não bằng hai con số: tỉ lệ tế bào kích thích đang hoạt động (E) và tỉ lệ tế bào ức chế đang hoạt động (I). Kích thích kéo theo ức chế, ức chế dập kích thích, và khi ức chế nhả ra thì kích thích lại tăng. Với độ mạnh phù hợp, vòng lặp này không bao giờ lắng xuống: nó trở thành một nhịp.</p>
<p><b>Đọc mặt phẳng pha.</b> Trên đường màu cam E không đổi, trên đường màu xanh I không đổi. Nơi chúng cắt nhau thì không gì thay đổi: một điểm cố định. Nếu điểm đó không ổn định, quỹ đạo màu vàng cuộn vào một vòng kín, gọi là chu trình giới hạn.</p>
<div class="try"><b>Thử 1: bật nhịp lên.</b> Kéo đầu vào P từ 0 lên. Im lặng cho đến khoảng 1, rồi một nhịp tăng tốc từ khoảng 20 lên 45 Hz, rồi từ khoảng 2,25 là một mức hoạt động ổn định, cao hơn.</div>
<div class="try"><b>Thử 2.</b> Làm yếu I → E (ít ức chế hơn): nhịp trước hết nhanh lên một chút, rồi dừng, và dưới khoảng 6 thì kích thích chạy vọt lên trần.</div>
<div class="try"><b>Thử 3.</b> Bấm vào các chỗ khác nhau trên mặt phẳng pha. Mọi điểm xuất phát đều kết thúc trên cùng một vòng: nhịp là thuộc tính của mạch, không phải của nơi nó bắt đầu.</div>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Đây là tổ tiên của các mô hình khối thần kinh dùng để diễn giải EEG và MEG, mô hình hoá cơn động kinh và xây dựng mô phỏng toàn não (Jansen & Rit 1995; Deco và cs. 2008). Chính vòng kích thích–ức chế này là cách giải thích hàng đầu cho nhịp gamma (Buzsáki & Wang 2012).</p>
<h3>Giới hạn</h3><p>Giá trị trung bình che mất thời điểm xung và các dao động ngẫu nhiên. Hãy so với mạng Brunel ở thẻ Mạng lưới, nơi cùng vòng lặp ấy được dựng từ 12 500 nơ-ron phát xung. Giá trị mặc định là ví dụ chu trình giới hạn của bài báo năm 1972; hằng số thời gian tính bằng mili giây là một lựa chọn tự do.</p>
<p class="refs">Wilson & Cowan 1972, Biophys J · Jansen & Rit 1995, Biol Cybern · Deco et al. 2008, PLoS Comput Biol · Buzsáki & Wang 2012, Annu Rev Neurosci</p>`,
lesson_kuramoto:`<h2>Cùng vào nhịp</h2><p><b>Mô hình.</b> Kuramoto (1975): mỗi bộ dao động có tần số tự nhiên riêng và bị kéo về pha trung bình của tất cả các bộ khác với độ mạnh K. Tham số trật tự r đo độ đồng bộ: bằng 0 khi các pha tản mát, bằng 1 khi tất cả cùng chuyển động.</p>
<h3>Đối chiếu lý thuyết</h3><p>Nếu tần số tự nhiên tuân theo phân bố Lorentz có nửa độ rộng γ, hệ vô hạn có lời giải chính xác: không có gì xảy ra dưới K<sub>c</sub> = 2γ, và phía trên r = √(1 − K<sub>c</sub>/K). <i>Quét K</i> so sánh 400 bộ dao động mô phỏng với đường cong đó. Dưới K<sub>c</sub> các chấm nằm hơi cao hơn 0 vì một nhóm hữu hạn không bao giờ tản mát hoàn hảo.</p>
<div class="try"><b>Thử 1.</b> Đặt K = 1: các chấm trôi độc lập. Đặt K = 2,5: một cụm hình thành trong khi những chấm nhanh nhất và chậm nhất vẫn vượt vòng. Đặt K = 5: gần như tất cả khoá pha.</div>
<div class="try"><b>Thử 2.</b> Ở K = 3 bấm <i>Xáo trộn pha</i>. Sự đồng bộ tự hình thành lại.</div>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Sự đồng bộ giữa các vùng não, đo bằng EEG và MEG, thường được diễn giải bằng các mô hình thuộc họ này, và các mô hình toàn não đặt những bộ dao động như vậy lên sơ đồ kết nối đo được (Breakspear, Heitmann & Daffertshofer 2010; Cabral và cs. 2011). Đồng bộ quá mức là dấu hiệu của cơn động kinh và của nhịp beta trong bệnh Parkinson.</p>
<h3>Giới hạn</h3><p>Mỗi bộ dao động chỉ có pha mà không có biên độ, ai cũng ghép với tất cả, và sự ghép là một hàm sin thuần. Tần số ở đây được đo tương đối so với nhịp trung bình.</p>
<p class="refs">Kuramoto 1975, Lecture Notes in Physics · Strogatz 2000, Physica D · Breakspear, Heitmann & Daffertshofer 2010, Front Hum Neurosci · Cabral et al. 2011, NeuroImage</p>`,
lesson_hh:`<h2>Một nơ-ron, hai trạng thái</h2><p><b>Phát hiện.</b> Trong một khoảng dòng nền, mô hình Hodgkin–Huxley có hai hành vi ổn định với cùng một đầu vào: nghỉ yên, hoặc phát xung lặp lại. Bạn thấy hành vi nào tuỳ vào lịch sử.</p>
<div class="try"><b>Thử 1: hiện tượng trễ.</b> Bấm <i>Quét</i>. Khi tăng dòng chậm, việc phát xung bắt đầu muộn. Khi giảm dòng trở lại, nó còn kéo dài tới một mức dòng thấp hơn nhiều. Vùng tô màu có hai đáp án.</div>
<div class="try"><b>Thử 2: bật lên.</b> Ở khung dưới, dòng nền không hề thay đổi. Một xung ngắn khởi động việc phát xung và nó tiếp tục vô thời hạn.</div>
<div class="try"><b>Thử 3: tắt đi.</b> Dùng mẫu sẵn thứ hai: một xung nhỏ, 7 đến 8,5 ms sau một xung thần kinh, dập tắt hẳn việc phát xung. Dịch độ trễ quá một mili giây là thất bại. Một xung trái dấu cũng có tác dụng, ở một thời điểm khác (thử −3 ở 13,5 ms). Thời điểm quan trọng hơn độ lớn.</div>
<div class="try"><b>Thử 4.</b> Thêm nhiễu rồi quét lại. Nơ-ron giờ nhảy qua lại giữa hai trạng thái và các mép bị nhoè.</div>
<h3>Lý thuyết</h3><p>Trạng thái nghỉ mất ổn định qua một rẽ nhánh Hopf dưới tới hạn ở gần 9,78 µA/cm², và việc phát xung lặp lại biến mất ở một điểm gấp của chu trình giới hạn gần 6,26 µA/cm² (Hassard 1978; Rinzel & Miller 1980). Một lần quét theo bước hữu hạn tìm thấy mép thứ nhất hơi muộn, vì ngay sau điểm rẽ nhánh nơ-ron rời trạng thái nghỉ rất chậm.</p>
<h3>Vì sao giới nghiên cứu quan tâm</h3><p>Guttman, Lewis & Rinzel (1980) đã làm Thử 3 trên sợi trục mực thật và thành công: một tiên đoán của phương trình được xác nhận trên con vật. Nơ-ron hai trạng thái ổn định là một cơ chế ứng viên để giữ thông tin mà không cần thay đổi khớp thần kinh (Egorov và cs. 2002; Loewenstein và cs. 2005).</p>
<h3>Giới hạn</h3><p>Đây là sợi trục mực ở 6,3 °C. Phần lớn nơ-ron vỏ não bắt đầu phát xung một cách trơn tru từ tần số 0 và không có hai trạng thái ổn định theo kiểu này.</p>
<p class="refs">Hassard 1978, J Theor Biol · Rinzel & Miller 1980, Math Biosci · Guttman, Lewis & Rinzel 1980, J Physiol · Egorov et al. 2002, Nature · Loewenstein et al. 2005, Nat Neurosci</p>`,
lesson_spikes:`<h2>Phân tích chuỗi xung</h2><p>Các thống kê bước đầu tiêu chuẩn cho dữ liệu xung, tính ngay trong trình duyệt của bạn. Không có gì được tải lên đâu cả.</p>
<h3>Dữ liệu của chính bạn</h3><p>Mở một tệp CSV hoặc văn bản, mỗi dòng một xung: thời gian, rồi số thứ tự nơ-ron, ngăn cách bằng dấu phẩy, chấm phẩy, tab hoặc dấu cách. Những dòng không bắt đầu bằng số sẽ bị bỏ qua. Hãy chọn trước đơn vị thời gian là mili giây hay giây. Tệp CSV xuất từ thẻ Mạng lưới có đúng định dạng này.</p>
<h3>Đọc các con số</h3><ul><li><b>CV(ISI)</b>: độ phân tán của khoảng giữa các xung chia cho trung bình của chúng. Nơ-ron vỏ não ở động vật thức có giá trị gần 1 (Softky & Koch 1993).</li><li><b>CV2</b>: so sánh mỗi khoảng với khoảng kế tiếp, nên thay đổi tần số chậm không làm nó phồng lên (Holt và cs. 1996).</li><li><b>Hệ số Fano</b>: phương sai của số xung đếm được chia cho trung bình. Nó giảm khi kích thích xuất hiện, ở nhiều vùng vỏ não (Churchland và cs. 2010).</li><li><b>Tương quan cặp</b>: giá trị điển hình giữa các nơ-ron vỏ não gần nhau là nhỏ, khoảng 0,01 đến 0,2, và phụ thuộc mạnh vào cách đo (Cohen & Kohn 2011).</li><li><b>Tự tương quan</b>: các đỉnh lặp lại cho thấy một nhịp; khoảng cách giữa các đỉnh là chu kỳ của nó.</li></ul>
<div class="try"><b>Thử.</b> Lần lượt xem bốn bộ dữ liệu mẫu. Poisson cho khoảng 1 ở CV, CV2 và hệ số Fano. Chuỗi đều đặn cho CV gần 0,35 và hệ số Fano dưới 1. Chuỗi phát theo chùm đẩy CV lên khoảng 1,9 và hệ số Fano lên khoảng 3 với cùng tần số trung bình.</div>
<div class="try"><b>Thử: nhịp ẩn.</b> Bộ dữ liệu 10 Hz là bộ đáng học nhất. CV và CV2 vẫn bằng 1 và hệ số Fano hầu như không đổi, nhưng tương quan cặp vọt lên khoảng 0,12 và tự tương quan hiện đỉnh cách nhau 100 ms. Giờ đặt cửa sổ đếm bằng 100 ms, đúng một chu kỳ: tương quan biến mất. Cửa sổ bạn chọn quyết định điều bạn thấy.</div>
<div class="try"><b>Thử với trình mô phỏng.</b> Chạy mạng Brunel ở thẻ Mạng lưới trong hai chế độ, mỗi lần bấm <i>Dùng raster của thẻ Mạng lưới</i> rồi so sánh.</div>
<h3>Giới hạn</h3><p>Đây là thống kê mô tả. Bản ghi ngắn, ít nơ-ron và tần số phát xung thay đổi đều làm lệch tất cả các chỉ số; hệ số Fano và tương quan đều phụ thuộc vào cửa sổ đếm.</p>
<p class="refs">Softky & Koch 1993, J Neurosci · Holt et al. 1996, J Neurophysiol · Churchland et al. 2010, Nat Neurosci · Cohen & Kohn 2011, Nat Neurosci</p>`,
lesson_power:`<h2>Lập kế hoạch nghiên cứu</h2><p>Cần bao nhiêu người tham gia để phát hiện một hiệu ứng có độ lớn cho trước. Dùng xấp xỉ chuẩn kèm hiệu chỉnh cho mẫu nhỏ; kết quả khớp với bảng của Cohen trong phạm vi một người. Hãy xác nhận con số cuối cùng bằng phần mềm chuyên dụng như G*Power trước khi đăng ký trước nghiên cứu.</p>
<h3>Công thức</h3><p>Hai nhóm: n mỗi nhóm = 2(z<sub>1−α/2</sub> + z<sub>lực</sub>)² / d² + z²<sub>1−α/2</sub>/4. Ghép cặp: n = (z<sub>1−α/2</sub> + z<sub>lực</sub>)² / d² + z²<sub>1−α/2</sub>/2, trong đó d là hiệu ứng trên điểm chênh lệch.</p>
<h3>Chọn d một cách trung thực</h3><p>Các nhãn của Cohen (0,2 nhỏ, 0,5 trung bình, 0,8 lớn) là phương án cuối cùng. Trong giáo dục, các thử nghiệm ngẫu nhiên làm tốt với thước đo chuẩn hoá có hiệu ứng trung vị gần 0,1 (Kraft 2020). Hãy lập kế hoạch cho hiệu ứng nhỏ nhất còn có ý nghĩa, không phải cho hiệu ứng bạn mong đợi.</p>
<h3>Lớp học</h3><p>Nếu cả lớp được phân vào một điều kiện, học sinh cùng lớp giống nhau và mỗi em đóng góp ít thông tin hơn. Cỡ mẫu phải tăng theo hệ số thiết kế 1 + (m − 1)·ICC, với m là sĩ số lớp (Kish 1965). Với thành tích học tập ở trường, ICC thường nằm giữa 0,1 và 0,25 (Hedges & Hedberg 2007).</p>
<div class="try"><b>Thử.</b> Đặt d = 0,3, sĩ số 25, ICC 0,15. So sánh số học sinh cần có khi phân theo lớp và khi không.</div>
<h3>Vì sao điều này quan trọng trong khoa học thần kinh</h3><p>Lực thống kê trung vị của các nghiên cứu khoa học thần kinh được ước tính khoảng 21 % (Button và cs. 2013). Những liên hệ đáng tin giữa số đo não và hành vi giữa các cá nhân cần hàng nghìn người tham gia (Marek và cs. 2022).</p>
<p class="refs">Cohen 1988, Statistical Power Analysis · Kish 1965, Survey Sampling · Hedges & Hedberg 2007, Educ Eval Policy Anal · Button et al. 2013, Nat Rev Neurosci · Kraft 2020, Educ Researcher · Marek et al. 2022, Nature</p>`
};
