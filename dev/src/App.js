import React from "react";
import { Option, Select } from "../../src";
// import { ReactComponent as ArrowDown } from "./svg/arrow-down.svg";

const options = [
  { value: "a", label: "a" },
  { value: "b", label: "b" },
  { value: "c", label: "c" },
  { value: "d", label: "d" },
  { value: "e", label: "e" },
  { value: "f", label: "fdasdagdfg df dg dgdfg dfg df sdas" },
];
// import {} from ""

// const IconComponent = (props) => {
//   const { className } = props;
//   return <ArrowDown className={className} />;
// };

// import * as s from "rc-simple-select"
function App() {
  return (
    <div className='root'>
      <Select
        isMulti={true}
        onSelect={(value) => {
          console.log(value);
        }}
        placeholder='fsdfsd'
        isSearchable={false}
        // IconComponent={IconComponent}
        renderValue={(value) => {
          return value.map((v, index) => <span key={index}>{v.label}</span>);
        }}>
        <Option value='a'>a</Option>
        <Option value='b' disabled>
          b
        </Option>
        <Option value='c'>c</Option>
        <Option value='d'>d</Option>
        <Option value='e'>e</Option>
        <Option value='Apple'>Apple</Option>
        <Option value='Abb'>Abb</Option>
        <Option value='Lorem Ipsum is simply dummy text of the printing and typesetting industry.'>
          <div>
            <span>
              {" "}
              ffsdfsdfsdfAbbAbfdsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdb
              {/* Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. */}
            </span>
          </div>
        </Option>

        <div>fgdf gfd </div>
      </Select>
      <select onChange={(e) => console.log(e)}>
        <option value='a'>A</option>
        <option value='b'>ABb</option>
        <option value='b'>App</option>
        <option value='b'>Abfsd</option>
        <option value='c'>c</option>
        <option value='dffsdf'>g</option>
        {/* <option value='d'>d</option>
        <option value='e'>e</option>
        <option value='@'>@</option>
        <option value='Apple'>Apple</option>
        <option value='Abba'>Abba</option> */}
      </select>
      <input list='fruits' id='fruitInput' name='fruitInput' />
      <datalist id='fruits'>
        <option value='a' />
        <option value='Apple' />
        <option value='Banana' />
        <option value='Grapes' />
        <option value='Orange' />
        <option value='Peach' />
        <option value='Pech' />
      </datalist>
      <div>here</div>
    </div>
  );
}

export default App;
