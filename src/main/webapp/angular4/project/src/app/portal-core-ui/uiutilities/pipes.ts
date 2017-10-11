import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getKey'})
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

//@Pipe({name: 'hideLayerGroup'})
//export class HideLayerGroup implements PipeTransform {
//  transform(value, args?): Array<any> {
//    if (value) {
//      return value.filter(layerGroup => {
//        if (layerGroup.hide) {
//          return false
//        } else {
//          return true;
//        }
//      });
//    }
//  }
//}
//
//
//@Pipe({name: 'hideLayer'})
//export class HideLayer implements PipeTransform {
// transform(value, args?): Array<any> {
//    if (value) {
//      return value.filter(layer => {
//        if (layer.hide) {
//          return false
//        } else {
//          return true;
//        }
//      });
//    }
//  }
//}
