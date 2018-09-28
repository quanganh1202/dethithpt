import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import Select from 'components/Select';
import Wrapper from './Wrapper';
import local from './newLocal.json';

const CreateUser = (props) => {
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
                    value={_.get(props.data, 'name') || ''}
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
                    value={_.get(props.data, 'phone') || ''}
                    placeholder="Nhập số điện thoại chính xác"
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Bạn là:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="role"
                    options={[
                      { text: 'Sinh viên', value: 'student' },
                    ]}
                    value={_.get(props.data, 'role') || ''}
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
                    value={_.get(props.data, 'bod') || ''}
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
                    options={local.map((city) => ({ text: city.name, value: city.code}))}
                    value={_.get(props.data, 'city') || ''}
                    defaultText={'Chọn Tỉnh/Thành phố'}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Quận/Huyện:<span className="red">(*)</span></td>
                <td>
                  {console.log(_.get(props.data, 'city'))}
                  <Select
                    name="district"
                    options={_.get(
                      local.find((city) => city.code === _.get(props.data, 'city')),
                      'districts', []
                    ).map((district) => ({ text: district.name, value: district.name }))}
                    value={_.get(props.data, 'district') || ''}
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
                      { text: 'Lớp 1', value: 'Lớp 1' },
                    ]}
                    value={_.get(props.data, 'level') || ''}
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
                    options={[
                      { text: 'Quang Trung', value: 'Quang Trung' },
                    ]}
                    value={_.get(props.data, 'school') || ''}
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
                    value={_.get(props.data, 'facebook') || ''}
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