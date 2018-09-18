import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .info-column {
    padding: 10px 30px;
    float: left;
    width: 50%;
    > h1 {
      font-size: 1.1em;
      color: #FF0000;
    }
    > .column-content {
      table tr th {
        text-align: left;
        padding: 5px 0;
        font-size: 0.9em;
      }
      table tr td {
        padding-left: 10px;
        font-size: 0.9em;
      }
    }
  }
  .info-column:nth-child(2) {
    > h1 {
      color: #2E87CC;
    }
  }

  /* 
    ##Device = Most of the Smartphones Mobiles (Portrait)
    ##Screen = B/w 320px to 479px
  */
  @media (min-width: 320px) and (max-width: 480px) {
    .info-column {
      width: 100%;
      > h1 {
        text-align: center;
      }
    }
  }
`;

const GeneralInformation = (props) => {
  return (
    <Wrapper className="general-information">
      <div className="info-column">
        <h1>THÔNG TIN TÀI KHOẢN</h1>
        <div className="column-content">
          <table>
            <tbody>
              <tr>
                <th>Email :</th>
                <td>{props.user.email}</td>
              </tr>
              <tr>
                <th>Họ tên :</th>
                <td>{props.user.name}</td>
              </tr>
              <tr>
                <th>Năm sinh :</th>
                <td>{props.user.bod}</td>
              </tr>
              <tr>
                <th>Bạn là :</th>
                <td>{props.user.role}</td>
              </tr>
              <tr>
                <th>Trường học :</th>
                <td>{props.user.school}</td>
              </tr>
              <tr>
                <th>Nơi ở :</th>
                <td>{`${props.user.district}, ${props.user.city}`}</td>
              </tr>
              <tr>
                <th>Số điện thoại :</th>
                <td>{props.user.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="info-column">
        <h1>THỐNG KÊ</h1>
        <div className="column-content">
          <table>
            <tbody>
              <tr>
                <th>Số tài liệu đã tải :</th>
                <td></td>
              </tr>
              <tr>
                <th>Số tài liệu đã đăng :</th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Wrapper>
  )
};

export default GeneralInformation;
