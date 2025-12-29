export class Modal {
  title: string;
  message: string;
  showConfirmButton: boolean;

  constructor(title: string, message: string, showConfirmButton: boolean) {
    this.title = title;
    this.message = message;
    this.showConfirmButton = showConfirmButton;
  }

  static data(isValidateChanges: boolean): Modal {
    if (isValidateChanges) {
      return Modal.validChanges();
    } else {
      return Modal.invalidChanges();
    }
  }

  static validChanges(): Modal {
    return new Modal(
      'Confirmar Alteração',
      'Esta alteração irá modificar as taxas do plano selecionado para todos os usuários. Altere somente se a taxa estiver desatualizada. Deseja confirmar?',
      true
    );
  }

  static invalidChanges(): Modal {
    return new Modal(
      'Nenhuma Alteração Detectada',
      'As taxas do plano selecionado permanecem inalteradas. Altere pelo menos uma taxa para prosseguir.',
      false
    );
  }
}
