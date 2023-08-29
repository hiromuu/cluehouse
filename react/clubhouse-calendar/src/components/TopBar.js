import styled from 'styled-components';

const Bar = styled.div`
  background-color: #333;
  padding: 10px 20px;
  color: white;
  text-align: center;
`;

const TopBar = () => {
  return <Bar>クルーハウスカレンダー</Bar>;
};

export default TopBar;