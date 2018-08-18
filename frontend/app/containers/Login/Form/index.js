import React from 'react';
import _ from 'lodash';
import Select from 'components/Select';
import Wrapper from './Wrapper';

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
          <table>
            <tbody>
              <tr>
                <td>Họ tên:<span className="red">(*)</span></td>
                <td>
                  <input type="text" name="name" value={_.get(props.data, 'name') || ''} onChange={props.onChange} />
                </td>
              </tr>
              <tr>
                <td>Số điện thoại:<span className="red">(*)</span></td>
                <td>
                  <input type="text" name="phone" value={_.get(props.data, 'phone') || ''} onChange={props.onChange} />
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
                  <Select
                    name="bod"
                    options={[
                      { text: '12/02/1990', value: '1990'}
                    ]}
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
                    options={[
                      { text: 'Hà Nội', value: 'Hà Nội' },
                    ]}
                    value={_.get(props.data, 'city') || ''}
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Quận/Huyện:<span className="red">(*)</span></td>
                <td>
                  <Select
                    name="district"
                    options={[
                      { text: 'Thanh Xuân Bắc', value: 'Thanh Xuân Bắc' },
                    ]}
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
                    onChange={props.onChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Facebook bạn (Nếu có):</td>
                <td>
                  <input type="text" name="facebook" value={_.get(props.data, 'facebook') || ''} onChange={props.onChange} />
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