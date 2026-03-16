package io.github.ds.planeja.infra;

import io.github.ds.planeja.dominio.cartao.CartaoRepository;
import io.github.ds.planeja.dominio.cartao.model.BandeiraCartao;
import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Sandbox implements CommandLineRunner {

    @Autowired
    private CartaoRepository repository;

    public void salvarCartao(){
        CartaoEntity cartao = new CartaoEntity();
        cartao.setNome("ITAU Personalité");
        cartao.setBandeira(BandeiraCartao.AMERICAN_EXPRESS);

        repository.save(cartao);
    }

    @Override
    public void run(String... args) throws Exception {
//        salvarCartao();
    }
}
