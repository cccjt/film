import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'

@Module({ stateFactory: true, store })
export default class AppModule extends VuexModule {
  /** state */
  private secretkey = ''

  /** getter */
  get getSecretkey() {
    return this.secretkey
  }

  /** mutations */
  @Mutation
  setSecretkey(data) {
    this.secretkey = data
  }
}

// export const appStore = getModule(AppModule)
