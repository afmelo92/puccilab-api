export default function setObjPropertyWithDefaultDescriptors(value: unknown) {
  return {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  };
}
