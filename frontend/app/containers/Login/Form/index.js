import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import Select from 'components/Select';
import Wrapper from './Wrapper';
import local from './newLocal.json';

const CreateUser = (props) => {
  const data = _.get(props, 'data') || {};
  const cityValue = _.get(data, 'city.value', '');
  const districtValue = _.get(data, 'district.value', '');
  const levelValue = _.get(data, 'level.value', '');
  const districts = _.get(local.find((city) => city.id === cityValue), 'districts', []);
  let school = _.get(districts.find((d) => d.id === districtValue), 'schools', []);
  if (levelValue) {
    school = school.filter((s) => _.get(s, 'class', []).includes(+levelValue));
  }
  return (
    <Wrapper>
      <div className="form-header">
        VUI LÒNG CẬP NHẬT THÔNG TIN ĐỂ TIẾP TỤC SỬ DỤNG WEBSITE
      </div>
      <div className="form-body">
        <p className="form-body-note">Hãy nhập chính xác thông tin để website có thể hỗ trợ bạn kịp thời khi cần.</p>
        <p className="form-body-note">Chúng tôi xin lỗi vì sự bất tiện này. Xin cám ơn!</p>
        <form onSubmit={props.onSubmit}>
          <p className="form-error">{props.error}</p>
          <table>
            <tbody>
              <tr>
                <td>Họ tên:<span className="red">(*)</span></td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={data.name || ''}
                    placeholder="Nhập họ và tên bạn"
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Số điện thoại:<span className="red">(*)</span></td>
                <td>
                  <input
                    type="text"
                    name="phone"
                    value={data.phone || ''}
                    placeholder="Nhập số điện thoại chính xác"
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Bạn là:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="position"
                    options={[
                      { text: 'Giáo viên Toán', value: 'math_teacher' },
                      { text: 'Giáo viên Vật Lý', value: 'physics_teacher' },
                      { text: 'Giáo viên Hóa Học', value: 'chemistry_teacher' },
                      { text: 'Giáo viên Sinh Học', value: 'biology_teacher' },
                      { text: 'Giáo viên Tiếng Anh', value: 'english_teacher' },
                      { text: 'Giáo viên Ngữ Văn', value: 'literature_teacher' },
                      { text: 'Giáo viên Lịch Sử', value: 'hítory_teacher' },
                      { text: 'Giáo viên Địa Lý', value: 'geography_teacher' },
                      { text: 'Giáo viên GDCD', value: 'civic_edu_teacher' },
                      { text: 'Giáo viên Tin Học', value: 'it_teacher' },
                      { text: 'Giáo viên Công Nghệ', value: 'technology_teacher' },
                      { text: 'Giáo viên Mỹ Thuật', value: 'fine_art_teacher' },
                      { text: 'Giáo viên Âm Nhạc', value: 'music_teacher' },
                      { text: 'Giáo viên Thể Dục', value: 'physical_edu_teacher' },
                      { text: 'Học Sinh', value: 'pupil' },
                      { text: 'Sinh viên', value: 'student' },
                      { text: 'Phụ Huynh', value: 'parent' },
                      { text: 'Gia Sư', value: 'tutor' },
                      { text: 'Khác', value: 'other' },
                    ]}
                    value={data.position || ''}
                    defaultText={'-- Vui lòng chọn chức danh --'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Năm sinh:<span className="red">(*)</span></td>
                <td>
                  {/* <DatePicker
                    selected={_.get(props.data, 'bod')}
                    onChange={(date) => props.onChange({
                      currentTarget: { name: 'bod', value: date }
                    })}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText={'-- Vui lòng chọn năm sinh --'}
                    tabIndex={1000}
                    className="bod-picker"
                    dateFormat={'DD/MM/YYYY'}
                  /> */}
                  <Select
                    name="bod"
                    options={Array(81)
                      .fill((new Date()).getFullYear() - 80)
                      .map((y, idx) => ({ value: y + idx, text: y + idx }))}
                    value={data.bod || ''}
                    defaultText={'-- Vui lòng chọn năm sinh --'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Tỉnh/Thành phố:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="city"
                    options={local.map((city) => ({ text: city.name, value: city.id}))}
                    value={cityValue}
                    defaultText={'Chọn Tỉnh/Thành phố'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Quận/Huyện:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="district"
                    options={districts
                      .map((district) => ({ text: district.name, value: district.id }))}
                    value={districtValue}
                    defaultText={'Chọn Quận/Huyện'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Chọn cấp học:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="level"
                    options={[
                      { text: 'Lớp 1', value: '1' },
                      { text: 'Lớp 2', value: '2' },
                      { text: 'Lớp 3', value: '3' },
                      { text: 'Lớp 4', value: '4' },
                      { text: 'Lớp 5', value: '5' },
                      { text: 'Lớp 6', value: '6' },
                      { text: 'Lớp 7', value: '7' },
                      { text: 'Lớp 8', value: '8' },
                      { text: 'Lớp 9', value: '9' },
                      { text: 'Lớp 10', value: '10' },
                      { text: 'Lớp 11', value: '11' },
                      { text: 'Lớp 12', value: '12' },
                      { text: 'Lớp 13', value: '13' },
                    ]}
                    value={levelValue || ''}
                    defaultText={'Chọn cấp học'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Chọn trường:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="school"
                    options={school
                      .map((school) => ({ text: school.name, value: school.id }))}
                    value={_.get(data, 'school.value') || ''}
                    defaultText={'Chọn trường đang và đã học tập'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Facebook bạn (Nếu có):</td>
                <td>
                  <input
                    type="text"
                    name="facebook"
                    value={data.facebook || ''}
                    placeholder="Dán link facebook của bạn"
                    onChange={props.onChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="control-btn">
            <button className="submit-btn" type="submit">Cập nhật thông tin</button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default CreateUser;
