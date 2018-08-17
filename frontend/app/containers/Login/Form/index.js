import React from 'react';
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
            <tr>
              <td>Họ tên:<span className="red">(*)</span></td>
              <td>
                <input type="text" name="fullname" onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Số điện thoại:<span className="red">(*)</span></td>
              <td>
                <input type="text" name="phone" onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Bạn là:<span className="red">(*)</span></td>
              <td>
                <Select name="type" options={[]} defaultText={'-- Vui lòng chọn chức danh --'} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Năm sinh:<span className="red">(*)</span></td>
              <td>
                <Select name="dob" options={[]} defaultText={'-- Vui lòng chọn năm sinh --'} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Tỉnh/Thành phố:<span className="red">(*)</span></td>
              <td>
                <Select name="city" options={[]} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Quận/Huyện:<span className="red">(*)</span></td>
              <td>
                <Select name="district" options={[]} defaultText={'Chọn Quận/Huyện'} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Chọn cấp học:<span className="red">(*)</span></td>
              <td>
                <Select name="grade" options={[]} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Chọn trường:<span className="red">(*)</span></td>
              <td>
                <Select name="school" options={[]} onChange={props.onChange} />
              </td>
            </tr>
            <tr>
              <td>Facebook bạn (Nếu có):</td>
              <td>
                <input type="text" name="facebook" onChange={props.onChange} />
              </td>
            </tr>
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